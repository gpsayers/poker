using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Poker
{
    public class DeckOfCards
    {
        public static List<int> GetNewDeck()
        {
            var list = new List<int>();

            for (int i = 1; i < 53; i++)
            {
                list.Add(i);
            }

            var array = list.ToArray();


            return FisherYatesShuffle(array).ToList();

        }

        public static int[] FisherYatesShuffle(int[] data)
        {
            int[] retVal = new int[data.Length];
            int[] ind = new int[data.Length];
            int index;
            Random rand = new Random();

            for (int i = 0; i < data.Length; ++i)
                ind[i] = 0;

            for (int i = 0; i < data.Length; ++i)
            {
                do
                {
                    index = rand.Next(data.Length);
                } while (ind[index] != 0);

                ind[index] = 1;
                retVal[i] = data[index];
            }

            return retVal;
        }   

    }

    public class Card
    {
        public Card(int _id, int _rank, string _suite)
        {
            id = _id;
            rank = _rank;
            suite = _suite;
        }

        public int id { get; set; }
        public int rank { get; set; }
        public string suite { get; set; }
    }

    public class Deck
    {
        public Card[] cards;

        public Deck()
        {
            cards = new Card[52];
            var id = 0;
            var index = 0;

            foreach (var suit in new[] { "Spades", "Hearts", "Clubs", "Diamonds", })
            {
                for (var rank = 2; rank <= 14; rank++)
                {
                    id++;
                    cards[index++] = new Card(id, rank, suit);
                }
            }
        }
    }

    public enum PokerHands
    {
        HighCard = 0,
        Pair = 1,
        TwoPair = 2,
        ThreeOfKind = 3,
        Straight = 4,
        Flush = 5,
        FullHouse = 6,
        FourOfKind = 7,
        StraightFlush = 8,
        RoyalFlush = 9
    }

    public class PokerGame
    {
        public int EvaluateHand(Card[] hand)
        {
            PokerHands handEnum = PokerHands.HighCard;
            int result = 0;
            int threeOfKindRank = 0;
            int pairRank = 0;

            var sortHand = hand.OrderBy(x => x.rank).ToArray();


            foreach (var suite in new[] { "Spades", "Hearts", "Clubs", "Diamonds", })
            {

                if ((hand.Where(x => x.suite == suite).Count() >= 5))
                {
                    handEnum = PokerHands.Flush;
                }

            }

            if (handEnum == PokerHands.Flush)
            {
                //Check for royal flush and straight flush

            }
            else
            {
                //Check for 4 of a kind
                for (var i = 6; i >= 3; i-- )
                {
                    if (sortHand[i].rank == sortHand[i-3].rank)
                    {
                        handEnum = PokerHands.FourOfKind;
                    }
                }

                //Check for 3 of a kind
                for (var i = 6; i >= 2; i--)
                {
                    if (sortHand[i].rank == sortHand[i - 2].rank)
                    {
                        threeOfKindRank = sortHand[i].rank;
                        break;
                    }

                }

                if (threeOfKindRank > 0)
                {
                    var otherCards = sortHand.Where(x => x.rank != threeOfKindRank).ToArray();

                    //Check for full house
                    for (var i = otherCards.Count()-1; i >= 0; i--)
                    {

                    }
                }

            }

            

            return result;
        }
    }

}