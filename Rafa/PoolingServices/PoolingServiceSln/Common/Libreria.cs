using System;
using System.Configuration;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.IO;

namespace Common
{
    public static class Libreria
    {
        public static void WriteErrorLog(Exception ex)
        {
            StreamWriter sw = null;
            string arch = ConfigurationManager.AppSettings["archivoLog"];
            try
            {
                sw = new StreamWriter(AppDomain.CurrentDomain.BaseDirectory + arch, true);
                sw.WriteLine(DateTime.Now.ToString() + ": " + ex.Source.ToString().Trim() + "; " + ex.Message.ToString().Trim());
                sw.Flush();
                sw.Close();

            }
            catch (System.IO.IOException e)
            {
                //Libreria.WriteErrorLog("Error inesperado en WS Bizagi: " + e.Message);
                System.Diagnostics.Debug.WriteLine(e.Message);
            }
            catch (Exception e)
            {
                System.Diagnostics.Debug.WriteLine("Error inesperado en libreria: " + e.Message);
            }

        }

        public static void WriteErrorLog(string Message, string arch)
        {
            StreamWriter sw = null;
            
            try
            {
                sw = new StreamWriter(AppDomain.CurrentDomain.BaseDirectory + arch, true);
                sw.WriteLine(DateTime.Now.ToString() + ": " + Message);
                sw.Flush();
                sw.Close();

            }
            catch (Exception e)
            {
                System.Diagnostics.Debug.WriteLine("Error inesperado en libreria: " + e.Message);
            }
        }
    }
}
