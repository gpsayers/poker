using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using Microsoft.AspNet.SignalR;

namespace Poker
{
    public class PokerServer : Hub
    {
        static private List<Player> playerList = new List<Player>();
        static private GameVariables gameVars = new GameVariables();

        public void deal()
        {
            if (gameVars.handInProgress)
            {
                //Cancel hand already in progress
                return;
            }

            gameVars.handInProgress = true;


            var playersInHand = playerList.Where(x => x.tableSeat > 0);


            if (!playersInHand.Any())
            {
                //No players cancel hand
                return;
            }

            var currentDealer = playersInHand.Where(x => x.connectionId == gameVars.dealer);

            if (currentDealer.Any())
            {
                var index = playersInHand.ToList().IndexOf(currentDealer.FirstOrDefault());
                if (index++ > playersInHand.Count() - 1)
                {
                    gameVars.dealer = playersInHand.ToList()[0].connectionId;
                }
                
            }
            else
            {
                gameVars.dealer = playersInHand.ToList()[0].connectionId;
            }

            gameVars.currentPlayers = playersInHand.Select(x => x.connectionId).ToList();

            //Get new shuffled deck of cards
            gameVars.deck = DeckOfCards.GetNewDeck();

            //burn one card
            gameVars.deck.RemoveAt(0);

            foreach (var player in playersInHand)
            {
                player.cards.Add(gameVars.deck[0]);
                gameVars.deck.RemoveAt(0);
                player.cards.Add(gameVars.deck[0]);
                gameVars.deck.RemoveAt(0);
            }

            gameVars.cardsInPlay.Add(gameVars.deck[0]);
            gameVars.deck.RemoveAt(0);
            gameVars.cardsInPlay.Add(gameVars.deck[0]);
            gameVars.deck.RemoveAt(0);
            gameVars.cardsInPlay.Add(gameVars.deck[0]);
            gameVars.deck.RemoveAt(0);

            gameVars.handInProgress = false;
        }

        public void getHand()
        {
            
        }

        public void AddPlayer(string name)
        {

            playerList.Add(new Player()
            {
                id = Guid.NewGuid().ToString(),
                name = name,
                cards = new List<int>(),
                connectionId = Context.ConnectionId,
                tableSeat = 0,
                money = 100
                
            });

            Clients.All.clientMessage(name + " has joined.");
            Clients.All.clientPlayerList(playerList.Select(x => x.name).ToArray());
        }


        public void GetPlayerList()
        {

            Clients.All.clientPlayerList(playerList.Select(x => x.name).ToArray());
        }

        public void GetSeatsList()
        {
            var query = playerList.Where(x => x.tableSeat > 0).Select(x => x.name);

            Clients.Caller.clientSeats(query.ToArray());
        }

        public void PlayerSit()
        {
            var query = playerList.Where(x => x.connectionId == Context.ConnectionId);

            if (query.Any())
            {
                query.FirstOrDefault().tableSeat = 100;
            }
            
        }

        public void PlayerStand()
        {
            var query = playerList.Where(x => x.connectionId == Context.ConnectionId);

            if (query.Any())
            {
                query.FirstOrDefault().tableSeat = 0;
            }
        }

        public void Send(string message, string name)
        {
            Clients.All.chatMessage(message, name);
        }

        public override Task OnDisconnected(bool stopCalled)
        {
            var playerQuery = playerList.Where(x => x.connectionId == Context.ConnectionId);

            if (playerQuery.Any())
            {

                if (playerQuery.FirstOrDefault().tableSeat > 0)
                {
                    //TODO: Take care of a player leaving in the game
                }
                
                Clients.All.clientMessage(playerQuery.FirstOrDefault().name + " has left.");

                playerList.Remove(playerQuery.FirstOrDefault());

                Clients.All.clientPlayerList(playerList.Select(x => x.name).ToArray());
            }
            return base.OnDisconnected(stopCalled);
        }

    }

    public class Player
    {
        public Player()
        {
            cards = new List<int>();
        }

        public string id { get; set; }
        public string name { get; set; }
        public List<int> cards { get; set; }
        public string connectionId { get; set; }
        public int tableSeat { get; set; }
        public int money { get; set; }
        public int ip { get; set; }
        public bool ready { get; set; }

    }

    public class GameVariables
    {
        public GameVariables()
        {
            cardsInPlay = new List<int>();
            currentPlayers = new List<string>();
        }

        public List<int> cardsInPlay { get; set; }
        public List<string> currentPlayers { get; set; }
        public int currentPot { get; set; }
        public string dealer { get; set; }
        public bool gameReady { get; set; }
        public List<int> deck { get; set; }
        public bool handInProgress { get; set; }


    }

    
}