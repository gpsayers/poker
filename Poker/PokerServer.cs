﻿using System;
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
        static private Card[] protoDeck = new Deck().cards;

        public void deal()
        {

            //Clear old cards
            foreach (var player in playerList)
            {
                player.cards = new List<int>();
            }

            gameVars.cardsInPlay = new List<int>();

            //Check if hand is already in progress
            if (gameVars.handInProgress)
            {
                //Cancel hand already in progress
                return;
            }

            var playersInHand = playerList.Where(x => x.tableSeat > 0);


            if (!playersInHand.Any())
            {
                //No players cancel hand
                return;
            }

            gameVars.handInProgress = true;
            gameVars.handPhase = HandPhase.Deal;
            gameVars.currentAmountToCall = 0;
            gameVars.currentRaise = 0;
            gameVars.currentPot = 0;
            gameVars.playerTurn = gameVars.dealer;
            gameVars.smallBlind = gameVars.dealer;

            gameVars.currentPlayers = playersInHand.Select(x => x.connectionId).ToList();

            //Get new shuffled deck of cards
            gameVars.deck = DeckOfCards.GetNewDeck();

            //burn one card
            gameVars.deck.RemoveAt(0);

            foreach (var player in playersInHand)
            {
                player.allin = false;
                player.folded = false;
                player.called = false;
                player.raised = false;

                player.cardsRevealed = false;
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


            gameVars.handPhase = HandPhase.FirstBet;

            Clients.All.dealAll();


        }

        public void getHand()
        {        

            var query = playerList.Where(x => x.connectionId == Context.ConnectionId);

            if (query.Any())
            {
                Clients.Caller.clientHand(query.FirstOrDefault().cards.ToArray());
            }
        }

        public void getTurn()
        {
            gameVars.handPhase = HandPhase.Turn;

            gameVars.cardsInPlay.Add(gameVars.deck[0]);
            gameVars.deck.RemoveAt(0);

            Clients.All.clientFlop(gameVars.cardsInPlay);

        }

        public void getRiver()
        {
            gameVars.handPhase = HandPhase.River;

            gameVars.cardsInPlay.Add(gameVars.deck[0]);
            gameVars.deck.RemoveAt(0);

            Clients.All.clientFlop(gameVars.cardsInPlay);
        }

        public void getFlop()
        {
            gameVars.handPhase = HandPhase.Flop;

             Clients.All.clientFlop(gameVars.cardsInPlay);

        }

        public void showOpp()
        {
            var query = playerList.Where(x => x.tableSeat > 0 && x.connectionId != Context.ConnectionId);

            if (query.Any())
            {
                if (!query.FirstOrDefault().cardsRevealed)
                {
                    Clients.Caller.oppCards(new int[] { 99, 99 });
                }
                else
                {
                    Clients.Caller.oppCards(query.FirstOrDefault().cards);
                }
            }
        }

        public void checkHand()
        {
            gameVars.handPhase = HandPhase.Score;

            var totalPlayerHand = new List<int>();

            var cardArray = new List<Card>();

            var query = playerList.Where(x => x.connectionId == Context.ConnectionId);

            if (query.Any())
            {
                foreach (var cih in query.FirstOrDefault().cards)
                {
                    totalPlayerHand.Add(cih);
                }
            }

            foreach (var cip in gameVars.cardsInPlay)
            {
                totalPlayerHand.Add(cip);
            }

            foreach (var cardId in totalPlayerHand)
            {
                cardArray.Add(protoDeck.Where(x => x.id == cardId).FirstOrDefault());
            }

            var hand = new PokerGame();

            var handResult = hand.EvaluateHand(cardArray.ToArray());

            Clients.Caller.clientScore(handResult);
        }

        public void selectNewDealer()
        {
            var playersInHand = playerList.Where(x => x.tableSeat > 0);

            var currentDealer = playersInHand.Where(x => x.name == gameVars.dealer);

            if (currentDealer.Any())
            {
                var index = playersInHand.ToList().IndexOf(currentDealer.FirstOrDefault());
                if (index++ > playersInHand.Count() - 1)
                {
                    gameVars.dealer = playersInHand.ToList()[0].name;
                }

            }
            else
            {
                gameVars.dealer = playersInHand.ToList()[0].name;
            }
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
                chips = 100,
                ready = false,
                cardsRevealed = false
                
            });

            Clients.All.clientMessage(name + " has joined.");
            Clients.All.clientPlayerList(playerList.Select(x => x.name).ToArray());
        }

        public void revealHand(bool reveal)
        {
            var query = playerList.Where(x => x.connectionId == Context.ConnectionId);

            if (query.Any())
            {
                query.FirstOrDefault().cardsRevealed = reveal;

            }
        }

        public void getPhase()
        {
            Clients.All.clientPhase(gameVars.handPhase);
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

            selectNewDealer();
        }

        public void PlayerStand()
        {
            //TODO: Take care of a player leaving in the game
            gameVars.handPhase = HandPhase.PreGame;
            gameVars.handInProgress = false;
            gameVars.cardsInPlay = new List<int>();

            var query = playerList.Where(x => x.connectionId == Context.ConnectionId);

            if (query.Any())
            {
                query.FirstOrDefault().tableSeat = 0;
            }
        }

        public void PlayerReady(bool ready)
        {

            var query = playerList.Where(x => x.connectionId == Context.ConnectionId);

            if (query.Any())
            {
                query.FirstOrDefault().ready = ready;
            }

            if (ready)
            {
                var readyQuery = playerList.Where(x => x.tableSeat > 0 && x.ready == true);

                if (readyQuery.Count() >= 2)
                {
                    gameVars.gameReady = true;
                }
            }
        }

        public void getGameInfo()
        {
            var oppQuery = playerList.Where(x => x.connectionId != Context.ConnectionId && x.tableSeat > 0 );

            if (oppQuery.Any())
            {
                var opponent = from i in oppQuery
                               select new
                               {
                                   i.chips,
                                   i.cardsRevealed,
                                   i.ready,
                                   i.name,
                                   i.tableSeat,
                                   i.allin,
                                   i.called,
                                   i.folded,
                                   i.raised
                               };

                var gameInfo = new
                {
                    gameVars.cardsInPlay,
                    gameVars.currentPlayers,
                    gameVars.currentPot,
                    gameVars.dealer,
                    gameVars.gameReady,
                    gameVars.handInProgress,
                    gameVars.handPhase,
                    gameVars.playerTurn,
                    gameVars.currentRaise,
                    gameVars.currentAmountToCall,
                    gameVars.smallBlind,
                    opponent = opponent
                };

                Clients.All.gameInfo(gameInfo);
            }
            else
            {
                var gameInfo = new
                {
                    gameVars.cardsInPlay,
                    gameVars.currentPlayers,
                    gameVars.currentPot,
                    gameVars.dealer,
                    gameVars.gameReady,
                    gameVars.handInProgress,
                    gameVars.handPhase,

                };

                Clients.All.gameInfo(gameInfo);
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
                    gameVars.handPhase = HandPhase.PreGame;
                    gameVars.handInProgress = false;
                    gameVars.currentAmountToCall = 0;
                    gameVars.currentRaise = 0;
                    gameVars.smallBlind = "";
                    gameVars.currentPot = 0;
                    gameVars.gameReady = false;
                    gameVars.playerTurn = "";
                    gameVars.cardsInPlay = new List<int>();
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
        public int chips { get; set; }
        public int ip { get; set; }
        public bool ready { get; set; }
        public bool cardsRevealed { get; set; }
        public bool folded { get; set; }
        public bool allin { get; set; }
        public bool called { get; set; }
        public bool raised { get; set; }

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
        public HandPhase handPhase { get; set; }
        public string playerTurn { get; set; }
        public int currentAmountToCall { get; set; }
        public int currentRaise { get; set; }
        public string smallBlind { get; set; }

    }

    public enum HandPhase
    {
        PreGame = 0,
        Deal = 1,
        FirstBet = 2,
        Flop = 3,
        SecondBet = 4,
        Turn = 5,
        FinalBet = 6,
        River = 7,
        Score = 8

    }
    
}
