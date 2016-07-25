using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;

namespace Clarizen
{
    public class TaskService : ITaskService
    {
        private SqlConnection CreateConnection()
        {
            string ConnStr = ConfigurationManager.ConnectionStrings["ConnectionStringName"].ConnectionString;
            return new SqlConnection(ConnStr);
        }

        public List<Models.CTask> GetAllParentTasks()
        {
            List<Models.CTask> tasksList = new List<Models.CTask>();
            using (SqlConnection myConnection = CreateConnection())
            {
                SqlCommand oCmd = new SqlCommand("GetAllParentTasks", myConnection);
                oCmd.CommandType = CommandType.StoredProcedure;

                myConnection.Open();
                using (SqlDataReader oReader = oCmd.ExecuteReader())
                {
                    while (oReader.Read())
                    {
                        Models.CTask task = new Models.CTask();
                        task.Id = oReader["Id"].ToString();
                        task.Name = oReader["Name"].ToString();
                        task.Owner = oReader["Owner"].ToString();
                        task.Parent = oReader["Parent"].ToString();
                        task.SubTaskCount = Convert.ToInt32(oReader["SubCount"]);

                        tasksList.Add(task);
                    }

                    myConnection.Close();
                }
            }

            return tasksList;
        }
        public List<Models.CTask> GetSubParentTasks(int id)
        {
            List<Models.CTask> tasksList = new List<Models.CTask>();
            using (SqlConnection myConnection = CreateConnection())
            {
                SqlCommand oCmd = new SqlCommand("GetSubParentTasks", myConnection);
                oCmd.CommandType = CommandType.StoredProcedure;

                // Add the input parameter and set its properties.
                SqlParameter parameter = new SqlParameter();
                parameter.ParameterName = "@TaskId";
                parameter.SqlDbType = SqlDbType.Int;
                parameter.Direction = ParameterDirection.Input;
                parameter.Value = id;

                // Add the parameter to the Parameters collection. 
                oCmd.Parameters.Add(parameter);

                myConnection.Open();
                using (SqlDataReader oReader = oCmd.ExecuteReader())
                {
                    while (oReader.Read())
                    {
                        Models.CTask task = new Models.CTask();
                        task.Id = oReader["Id"].ToString();
                        task.Name = oReader["Name"].ToString();
                        task.Owner = oReader["Owner"].ToString();
                        task.Parent = oReader["Parent"].ToString();
                        task.SubTaskCount = Convert.ToInt32(oReader["SubCount"]);

                        tasksList.Add(task);
                    }

                    myConnection.Close();
                }
            }

            return tasksList;
        }
        public Models.CTask AddNewTask(Models.CTask taskObj)
        {
            Models.CTask task = new Models.CTask();

            using (SqlConnection myConnection = CreateConnection())
            {
                SqlCommand oCmd;
                oCmd = new SqlCommand("AddNewTask", myConnection);

                oCmd.CommandType = CommandType.StoredProcedure;
                oCmd.Parameters.AddWithValue("@Name", taskObj.Name);
                oCmd.Parameters.AddWithValue("@Owner", taskObj.Owner);
                if (taskObj.Id != null)
                {
                    oCmd.Parameters.AddWithValue("@Id", taskObj.Id);
                }
                else
                {
                    oCmd.Parameters.AddWithValue("@Id", DBNull.Value);
                }

                myConnection.Open();
                using (SqlDataReader oReader = oCmd.ExecuteReader())
                {
                    while (oReader.Read())
                    {
                        task.Id = oReader["Id"].ToString();
                        task.Name = oReader["Name"].ToString();
                        task.Owner = oReader["Owner"].ToString();
                        task.Parent = oReader["Parent"].ToString();
                    }

                    myConnection.Close();
                }
            }

            return task;
        }
        public int DeleteTask(int id)
        {
            int retVal = 0;

            using (SqlConnection myConnection = CreateConnection())
            {
                SqlCommand oCmd = new SqlCommand("DeleteTask", myConnection);
                oCmd.CommandType = CommandType.StoredProcedure;
                oCmd.Parameters.AddWithValue("@TaskId", id);

                myConnection.Open();
                retVal = oCmd.ExecuteNonQuery();
                myConnection.Close();
            }

            return retVal;
        }
    }
}
