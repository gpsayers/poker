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
        public decimal EvaluateHand(Card[] hand)
        {
            PokerHands handEnum = PokerHands.HighCard;
            int threeOfKindRank = 0;
            int pairRank = 0;
            int highFlushRank = 0;

            var sortHand = hand.OrderBy(x => x.rank).ToArray();


            foreach (var suite in new[] { "Spades", "Hearts", "Clubs", "Diamonds", })
            {

                if ((sortHand.Where(x => x.suite == suite).Count() >= 5))
                {
                    highFlushRank = sortHand[sortHand.Length - 1].rank;
                }

            }

            if (highFlushRank > 0)
            {
                //Check for royal flush and straight flush
                //TODO:



                //Else just a flush
                handEnum = PokerHands.Flush;

                return Int32.Parse(((int)handEnum).ToString() + highFlushRank.ToString("00"));
            }
            else
            {
                //Check for 4 of a kind
                for (var i = 6; i >= 3; i-- )
                {
                    if (sortHand[i].rank == sortHand[i-3].rank)
                    {
                        handEnum = PokerHands.FourOfKind;

                        return Int32.Parse(((int)PokerHands.FourOfKind).ToString() + sortHand[i].rank.ToString("00"));
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
                    for (var i = otherCards.Count()-1; i >= 1; i--)
                    {
                        if (otherCards[i].rank == otherCards[i-1].rank)
                        {
                            pairRank = otherCards[i].rank;

                            return Decimal.Parse(((int)PokerHands.FullHouse).ToString() + threeOfKindRank.ToString("00") + "." + pairRank.ToString("00"));
                        }
                    }

                }

                //Check for straight
                var sQuery = sortHand.GroupBy(x => x.rank).Select(g => g.Key).ToList();


                if (sQuery.Count() >= 5)
                {
                    if (sQuery.ElementAt(sQuery.Count - 1) == 14)
                    {
                        sQuery.Add(1);
                        var nQuery = sQuery.OrderBy(x => x).ToList();
                        sQuery = nQuery;
                    }

                    for (var i = 0; i <= 3; i++)
                    {
                        if (isStraight(sQuery.Skip(i).Take(5).ToArray()))
                        {
                            return Decimal.Parse(((int)PokerHands.Straight).ToString() + sQuery.Skip(i).Take(5).ElementAt(sQuery.Count() - 1).ToString("00"));
                        }
                    }

                }

                //Three of a kind
                if (threeOfKindRank > 0)
                {
                    return Decimal.Parse(((int)PokerHands.ThreeOfKind).ToString() + threeOfKindRank.ToString("00"));
                }

                //Check for pair
                for (var i = sortHand.Count() - 1; i >= 1; i--)
                {
                    if (sortHand[i].rank == sortHand[i - 1].rank)
                    {
                        pairRank = sortHand[i].rank;
                        break;
                    }
                }

                if (pairRank > 0)
                {
                    //Check for second pair
                    var remainCards = sortHand.Where(x => x.rank != pairRank).ToArray();

                    for (var i = remainCards.Count() - 1; i >= 1; i--)
                    {
                        if (remainCards[i].rank == remainCards[i - 1].rank)
                        {
                            var twopairRank = remainCards[i].rank;

                            return Decimal.Parse(((int)PokerHands.TwoPair).ToString() + pairRank.ToString("00") + "." + twopairRank.ToString("00"));
                        }
                    }

                    return Decimal.Parse(((int)PokerHands.Pair).ToString() + pairRank.ToString("00"));
                }

                return Decimal.Parse(((int)PokerHands.HighCard).ToString() + sortHand[sortHand.Length - 1].rank.ToString("00"));
            }


        }

        public bool isStraight(int[] cardArray)
        {
            try
            {
                if (cardArray[0] < cardArray[1]
    && cardArray[1] < cardArray[2]
    && cardArray[2] < cardArray[3]
    && cardArray[3] < cardArray[4]
    && cardArray[4] < cardArray[5])
                {
                    return true;
                }
            }
            catch
            {

            }

            return false;
        }
    }

}