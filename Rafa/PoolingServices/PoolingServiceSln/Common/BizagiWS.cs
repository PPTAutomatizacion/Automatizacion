using System;
using System.Configuration;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml;
using System.Net;
using System.IO;

namespace Common
{
    public static class BizagiWS
    {

        public static void ExecuteBIZ_WithoutCAT(string dominio, string usuario, string proceso, string url_WS, string arch)
        {

            try
            {                

                HttpWebRequest request = CreateWebRequest(url_WS);
                XmlDocument soapEnvelopeXml = new XmlDocument();                

                StringBuilder soapRequest = new StringBuilder("<soap:Envelope xmlns:soap=\"http://schemas.xmlsoap.org/soap/envelope/\" ");
                soapRequest.Append("xmlns:tem=\"http://tempuri.org/\"><soap:Body>");
                soapRequest.Append("<tem:createCases><tem:casesInfo><BizAgiWSParam>");
                soapRequest.Append("<domain>" + dominio + "</domain><userName>" + usuario + "</userName>");
                soapRequest.Append("<Cases><Case><Process>" + proceso + "</Process>");
                soapRequest.Append("<Entities></Entities></Case></Cases></BizAgiWSParam></tem:casesInfo></tem:createCases>");
                soapRequest.Append("</soap:Body></soap:Envelope>");

                soapEnvelopeXml.LoadXml(soapRequest.ToString());

                using (Stream stream = request.GetRequestStream())
                {
                    soapEnvelopeXml.Save(stream);
                }

                using (WebResponse response = request.GetResponse())
                {
                    using (StreamReader rd = new StreamReader(response.GetResponseStream()))
                    {

                        //1. Obtengo respuesta WS
                        string respuesta = rd.ReadToEnd();
                        XmlDocument xmlDoc = new XmlDocument();
                        xmlDoc.LoadXml(respuesta);
                        
                        //2. Extraigo datos.                       
                        XmlNodeList nErrorCode = xmlDoc.GetElementsByTagName("errorCode");
                        string error = nErrorCode[0].InnerText;
                        if (error.Trim() == "")
                        {
                            XmlNodeList nCaso = xmlDoc.GetElementsByTagName("processRadNumber");
                            string caso = nCaso[0].InnerText;
                            Libreria.WriteErrorLog("RespuestaWS -> Caso Generado: " + caso + " ErrorCode:  ->  ErrorMessage: ", arch);
                        }
                        else
                        {
                            XmlNodeList nErrorMessage = xmlDoc.GetElementsByTagName("errorMessage");
                            string errorMessage = nErrorMessage[0].InnerText;
                            Libreria.WriteErrorLog("RespuestaWS -> ErrorCode: " + error + " ErrorMessage: " + errorMessage, arch);
                        }
                        
                    }
                }
            }           
            catch (System.IO.IOException e)
            {
                Libreria.WriteErrorLog("Error inesperado en sistema: " + e.Message, arch);
            }
            catch (Exception e)
            {
                Libreria.WriteErrorLog("Error inesperado en WS Bizagi: " + e.Message, arch);
            }
        }

        public static void ExecuteBIZ_WitCAT(string dominio, string usuario, string proceso, string url_WS, string CAT, string arch)
        {

            try
            {
                
                HttpWebRequest request = CreateWebRequest(url_WS);
                XmlDocument soapEnvelopeXml = new XmlDocument();
                string vTagCAT = "<" + CAT + "></" + CAT + ">";
                StringBuilder soapRequest = new StringBuilder("<soap:Envelope xmlns:soap=\"http://schemas.xmlsoap.org/soap/envelope/\" ");
                soapRequest.Append("xmlns:tem=\"http://tempuri.org/\"><soap:Body>");
                soapRequest.Append("<tem:createCases><tem:casesInfo><BizAgiWSParam>");
                soapRequest.Append("<domain>" + dominio + "</domain><userName>" + usuario + "</userName>");
                soapRequest.Append("<Cases><Case><Process>" + proceso + "</Process>");
                soapRequest.Append("<Entities>"+vTagCAT+"</Entities></Case></Cases></BizAgiWSParam></tem:casesInfo></tem:createCases>");
                soapRequest.Append("</soap:Body></soap:Envelope>");

                soapEnvelopeXml.LoadXml(soapRequest.ToString());

                using (Stream stream = request.GetRequestStream())
                {
                    soapEnvelopeXml.Save(stream);
                }

                using (WebResponse response = request.GetResponse())
                {
                    using (StreamReader rd = new StreamReader(response.GetResponseStream()))
                    {

                        //1. Obtengo respuesta WS
                        string respuesta = rd.ReadToEnd();
                        XmlDocument xmlDoc = new XmlDocument();
                        xmlDoc.LoadXml(respuesta);

                        //2. Extraigo datos.                       
                        XmlNodeList nErrorCode = xmlDoc.GetElementsByTagName("errorCode");
                        string error = nErrorCode[0].InnerText;
                        if (error.Trim() == "")
                        {
                            XmlNodeList nCaso = xmlDoc.GetElementsByTagName("processRadNumber");
                            string caso = nCaso[0].InnerText;
                            Libreria.WriteErrorLog("RespuestaWS -> Caso Generado: " + caso + " ErrorCode:  ->  ErrorMessage: ",arch);
                        }
                        else
                        {
                            XmlNodeList nErrorMessage = xmlDoc.GetElementsByTagName("errorMessage");
                            string errorMessage = nErrorMessage[0].InnerText;
                            Libreria.WriteErrorLog("RespuestaWS -> ErrorCode: " + error + " ErrorMessage: " + errorMessage,arch);
                        }

                    }
                }
            }
            catch (System.IO.IOException e)
            {
                Libreria.WriteErrorLog("Error inesperado en WS Bizagi: " + e.Message,arch);
            }
        }
        /// <summary>
        /// Create a soap webrequest to [Url]
        /// </summary>
        /// <returns></returns>
        public static HttpWebRequest CreateWebRequest(string url_WS)
        {            
            HttpWebRequest webRequest = (HttpWebRequest)WebRequest.Create(url_WS);            
            webRequest.Headers.Add(@"SOAP:Action");
            webRequest.ContentType = "text/xml;charset=\"utf-8\"";
            webRequest.Accept = "text/xml";
            webRequest.Method = "POST";
            return webRequest;
        }
    }
}
