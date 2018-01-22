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




}