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
        public List<int> cardsInPlay { get; set; }
        public List<string> currentPlayers { get; set; }
        public int currentPot { get; set; }
        public string dealer { get; set; }
        public bool gameReady { get; set; }
        public int[] deck { get; set; }
        public bool newGame { get; set; }
    }

    
}