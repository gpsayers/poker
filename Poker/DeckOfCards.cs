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

    class Deck
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


}