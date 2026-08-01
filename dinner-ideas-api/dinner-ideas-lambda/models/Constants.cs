namespace dinner_ideas_lambda.models;

public class Constants
{
    public static string TABLE_NAME =>
        Environment.GetEnvironmentVariable("TABLE_NAME") ?? "dinner-ideas-table";

    public const string ID_KEY = "typeAndId";
}