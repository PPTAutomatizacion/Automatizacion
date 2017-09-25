using System;
using System.Configuration;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data.SqlClient;
using System.IO;
using System.Data;


namespace Common
{
    public static class DataCC
    {
        // run a stored procedure that takes a parameter
        public static int RunStoredProcParams(string conex, string storeName, string storeNameOutParameter, string arch)
        {
            SqlConnection conn = null;

            try
            {
                // create and open a connection object                
                conn = new SqlConnection(conex);
                conn.Open();

                // 1. create a command object identifying
                // the stored procedure
                SqlCommand cmd = new SqlCommand(storeName, conn);

                // 2. set the command object so it knows
                // to execute a stored procedure
                cmd.CommandType = System.Data.CommandType.StoredProcedure;
                
                cmd.Parameters.Add(new SqlParameter(storeNameOutParameter, SqlDbType.Int));
                cmd.Parameters[storeNameOutParameter].Direction = ParameterDirection.Output;

                cmd.ExecuteNonQuery();
                int vRequest = (int)cmd.Parameters[storeNameOutParameter].Value;
                conn.Close();

                Libreria.WriteErrorLog("RespuestaBD -> Novedad: " + vRequest, arch);
                return vRequest;
            }
            catch (SqlException e)
            {
                Libreria.WriteErrorLog("Error en base de datos: " + e.Message, arch);
                return 0;
            }
            catch (System.IO.IOException e)
            {
                Libreria.WriteErrorLog("Error inesperado de sistema: " + e.Message, arch);
                return 0;
            }
            catch (Exception e)
            {
                Libreria.WriteErrorLog("Error inesperado en Base: " + e.Message, arch);
                return 0;
            }
            finally
            {
                if (conn != null)
                {
                    conn.Close();
                }
            }
        }

        public static int RunStoredProcParamsWhitParam(string conex, string storeName, string storeNameOutParameter, string arch, string storeNameInParameter)
        {
            SqlConnection conn = null;

            try
            {
                // create and open a connection object                
                conn = new SqlConnection(conex);
                conn.Open();

                // 1. create a command object identifying
                // the stored procedure
                SqlCommand cmd = new SqlCommand(storeName, conn);

                // 2. set the command object so it knows
                // to execute a stored procedure
                cmd.CommandType = System.Data.CommandType.StoredProcedure;

                cmd.Parameters.Add(new SqlParameter("@iOperacion", SqlDbType.VarChar));
                cmd.Parameters["@iOperacion"].Direction = ParameterDirection.Input;
                cmd.Parameters["@iOperacion"].Value = storeNameInParameter;                

                cmd.Parameters.Add(new SqlParameter(storeNameOutParameter, SqlDbType.Int));
                cmd.Parameters[storeNameOutParameter].Direction = ParameterDirection.Output;

                cmd.ExecuteNonQuery();
                int vRequest = (int)cmd.Parameters[storeNameOutParameter].Value;
                conn.Close();

                Libreria.WriteErrorLog("RespuestaBD -> Novedad: " + vRequest, arch);
                return vRequest;
            }
            catch (SqlException e)
            {
                Libreria.WriteErrorLog("Error en base de datos: " + e.Message, arch);
                return 0;
            }
            catch (System.IO.IOException e)
            {
                Libreria.WriteErrorLog("Error inesperado de sistema: " + e.Message, arch);
                return 0;
            }
            catch (Exception e)
            {
                Libreria.WriteErrorLog("Error inesperado en Base: " + e.Message, arch);
                return 0;
            }
            finally
            {
                if (conn != null)
                {
                    conn.Close();
                }
            }
        }
    }
}

