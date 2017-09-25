using System;
using System.Configuration;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Diagnostics;
using System.Linq;
using System.ServiceProcess;
using System.Text;
using System.Threading.Tasks;
using System.Timers;
using Common;

namespace ServiceSAAS_Proyecto
{
    public partial class ServicePooling : ServiceBase
    {
        private Timer time1 = null;
        private Timer timeBaja = null;
        string dominio = ConfigurationManager.AppSettings["dominio"];
        string usuario = ConfigurationManager.AppSettings["usuario"];
        string proceso = ConfigurationManager.AppSettings["procesoBIZ"];
        string cat = ConfigurationManager.AppSettings["tCAT"];
        string url_WS = ConfigurationManager.AppSettings["BizagiUrl"];
        string arch = ConfigurationManager.AppSettings["archivoLog"];
        string storeName = ConfigurationManager.AppSettings["storeName"];
        string storeNameBaja = ConfigurationManager.AppSettings["storeNameBaja"];
        string storeNameOutParameter = ConfigurationManager.AppSettings["storeNameOutParameter"];
        string conex = ConfigurationManager.ConnectionStrings["Default"].ConnectionString;        
        public ServicePooling()
        {
            InitializeComponent();
        }

        protected override void OnStart(string[] args)
        {
            int intervaloPooling = Convert.ToInt32(ConfigurationManager.AppSettings["intervaloPooling"]);
            int intervaloPoolingBaja = Convert.ToInt32(ConfigurationManager.AppSettings["intervaloPoolingBaja"]);
            time1 = new Timer();
            this.time1.Interval = intervaloPooling;
            this.time1.Elapsed += new System.Timers.ElapsedEventHandler(this.timer1_Tick);
            time1.Enabled = true;
            //****Timer de Baja************
            timeBaja = new Timer();
            this.timeBaja.Interval = intervaloPoolingBaja;
            this.timeBaja.Elapsed += new System.Timers.ElapsedEventHandler(this.timerBaja_Tick);
            timeBaja.Enabled = true;
            //***********
            Libreria.WriteErrorLog("Servicios iniciado.", arch);
        }

        private void timer1_Tick(object sender, ElapsedEventArgs e)
        {
            Libreria.WriteErrorLog("Tiempo escrito despues de " + (Convert.ToInt32(ConfigurationManager.AppSettings["intervaloPooling"]) / 1000) + " segundos de manera satisfactoria.",arch);

            int novedad = DataCC.RunStoredProcParams(conex,storeName,storeNameOutParameter,arch);           
            if (novedad > 0)
            {
                Libreria.WriteErrorLog("Hay novedad se invoca a proceso bizagi.",arch);               
                BizagiWS.ExecuteBIZ_WitCAT(dominio, usuario, proceso, url_WS, cat, arch);
            }
            else
            {
                Libreria.WriteErrorLog("No hay novedades",arch);
            }
        }

        private void timerBaja_Tick(object sender, ElapsedEventArgs e)
        {
            Libreria.WriteErrorLog("Tiempo escrito despues de " + (Convert.ToInt32(ConfigurationManager.AppSettings["intervaloPoolingBaja"]) / 1000) + " segundos de manera satisfactoria.[ProcesoBaja]", arch);

            int novedad = DataCC.RunStoredProcParams(conex, storeNameBaja, storeNameOutParameter, arch);
            if (novedad > 0)
            {
                Libreria.WriteErrorLog("Hay novedad de BAJA se invoca a proceso bizagi.", arch);
                BizagiWS.ExecuteBIZ_WitCAT(dominio, usuario, proceso, url_WS, cat, arch);
            }
            else
            {
                Libreria.WriteErrorLog("No hay novedades BAJA", arch);
            }
        }

        protected override void OnStop()
        {
            time1.Enabled = false;
            timeBaja.Enabled = false;
            Libreria.WriteErrorLog("Servicios stopeado.",arch);
        }
    }
}
