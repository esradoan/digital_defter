using System;
using MySqlConnector;

public class Program
{
    public static void Main(string[] args)
    {
        var connectionString = "server=127.0.0.1;port=3306;database=labmanager_db;uid=root;pwd=1234;SslMode=None;AllowPublicKeyRetrieval=True;";
        Console.WriteLine("Attempting to fix database schema...");

        try
        {
            using var connection = new MySqlConnection(connectionString);
            connection.Open();
            Console.WriteLine("Connected to database.");

            // Commands to execute
            var commands = new[]
            {
                "ALTER TABLE `Products` ADD COLUMN `SerialNumber` longtext CHARACTER SET utf8mb4 NULL;",
                "ALTER TABLE `Products` MODIFY COLUMN `Unit` longtext CHARACTER SET utf8mb4 NULL;",
                "ALTER TABLE `Products` MODIFY COLUMN `StorageCondition` longtext CHARACTER SET utf8mb4 NULL;",
                "ALTER TABLE `Products` MODIFY COLUMN `Name` longtext CHARACTER SET utf8mb4 NULL;",
                "ALTER TABLE `Products` MODIFY COLUMN `CategoryId` int NULL;"
            };

            foreach (var cmdText in commands)
            {
                try 
                {
                    using var cmd = new MySqlCommand(cmdText, connection);
                    cmd.ExecuteNonQuery();
                    Console.WriteLine($"Executed: {cmdText}");
                }
                catch (Exception ex)
                {
                    // Ignore "Duplicate column name" exists errors, report others
                    if (ex.Message.Contains("Duplicate column"))
                    {
                        Console.WriteLine($"Skipped (Already exists): {cmdText}");
                    }
                    else
                    {
                         Console.WriteLine($"Error executing: {cmdText} - {ex.Message}");
                    }
                }
            }

            Console.WriteLine("Schema update process finished.");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Critical connection failure: {ex.Message}");
        }
    }
}
