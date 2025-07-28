# Competitions Database Integration Setup

This guide will help you set up your `competitions` collection in Directus to work with the Raas All Stars Scoreboard Hub.

## Directus Collection Setup

Create a new collection called `competitions` in your Directus admin panel with the following fields:

### Required Fields

1. **id** (Primary Key)
   - Type: UUID
   - Auto-generate: Yes

2. **name** (String)
   - Type: String
   - Required: Yes
   - Example: "Raas All Stars"

3. **city** (String)
   - Type: String
   - Required: Yes
   - Example: "Orlando, FL"

4. **date** (Date)
   - Type: Date
   - Required: Yes
   - Example: "2024-03-15"

### Optional Fields

5. **logo** (File)
   - Type: File
   - Required: No
   - Description: Competition logo image

6. **lineup** (JSON Array of Strings)
   - Type: JSON
   - Required: No
   - Description: List of teams participating in the competition
   - Example: `["Texas Raas", "CMU Raasta", "Purdue Raas"]`

7. **firstplace** (String)
   - Type: String
   - Description: Name of the team that placed first

8. **secondplace** (String)
   - Type: String
   - Description: Name of the team that placed second

9. **thirdplace** (String)
   - Type: String
   - Description: Name of the team that placed third

10. **judges** (JSON Array of Objects)
    - Type: JSON
    - Description: List of judges and their categories
    - Example: `[{"name": "Judge A", "category": "Choreography"}, {"name": "Judge B", "category": "Formations"}]`

11. **instagramlink** (String)
    - Type: String
    - Description: Link to the competition's Instagram page

## Field Mapping

| Directus Field | App Field | Type | Notes |
|----------------|-----------|------|-------|
| `id` | `id` | string | Primary key |
| `name` | `name` | string | Competition name |
| `city` | `city` | string | City where the competition is held |
| `date` | `date` | string | Date of the competition |
| `logo` | `logo` | string (URL) | Competition logo image |
| `lineup` | `lineup` | string[] | List of participating teams |
| `firstplace` | `placings.first` | string | First place team |
| `secondplace` | `placings.second` | string | Second place team |
| `thirdplace` | `placings.third` | string | Third place team |
| `judges` | `judges` | object[] | List of judges |
| `instagramlink` | `instagramlink` | string | Instagram URL |

## Sample Competition Data

Here's an example of how to structure your competition data in Directus:

```json
{
  "id": "5",
  "name": "Raas All Stars 2024",
  "city": "Orlando, FL",
  "date": "2024-03-15",
  "logo": "your_logo_file_id_or_name",
  "lineup": ["Texas Raas", "CMU Raasta", "Purdue Raas"],
  "firstplace": "Texas Raas",
  "secondplace": "CMU Raasta",
  "thirdplace": "Purdue Raas",
  "judges": [
    {"name": "Judge A", "category": "Choreography"},
    {"name": "Judge B", "category": "Formations"}
  ],
  "instagramlink": "https://instagram.com/raasallstars"
}
```

## Testing

1. Add a competition to your Directus `competitions` collection using the sample data format
2. Make sure a team has this competition ID in their `competitions_attending` field
3. Start the development server: `npm run dev`
4. Open a team detail modal and check the "Competitions Attending" section
5. Click on a competition to verify it opens the competition detail modal

## Troubleshooting

If you see "Competition 5" instead of the actual competition name:
1. Check that your `competitions` collection exists in Directus
2. Verify that the competition with ID "5" exists in your competitions collection
3. Check the browser console for debugging information about competitions data
4. Ensure your API token has read permissions for the competitions collection 