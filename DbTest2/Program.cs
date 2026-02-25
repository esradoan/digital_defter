using System;
using MySqlConnector;

class Program
{
    static void Main()
    {
        string connectionString = "Server=localhost;Port=3306;Database=labmanager_db;User=root;Password=1234;";
        using (var connection = new MySqlConnection(connectionString))
        {
            connection.Open();
            try {
                using (var command = new MySqlCommand("ALTER TABLE labmanager_db.Products MODIFY COLUMN Unit varchar(50) NULL;", connection))
                {
                    command.ExecuteNonQuery();
                    Console.WriteLine("Unit column modified successfully.");
                }
            } catch (Exception ex) {
                Console.WriteLine("Error modifying Unit: " + ex.Message);
            }
        }
    }
}
