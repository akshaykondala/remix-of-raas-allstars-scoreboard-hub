# Teams Database Integration Setup

This guide will help you set up your teams collection in Directus to work with the Raas All Stars Scoreboard Hub.

## Directus Collection Setup

Your `teams` collection is already set up with the following fields:

### Current Fields

1. **id** (Primary Key)
   - Type: UUID
   - Auto-generate: Yes

2. **name** (String)
   - Type: String
   - Required: Yes
   - Example: "Texas Raas"

3. **university** (String)
   - Type: String
   - Required: Yes
   - Example: "University of Texas at Austin"

4. **logo** (File)
   - Type: File
   - Required: No
   - Example: Team logo image

5. **city** (String)
   - Type: String
   - Required: No
   - Example: "Austin, TX"

6. **instagramlink** (String)
   - Type: String
   - Required: No
   - Example: "https://instagram.com/texasraas"

7. **bidpoints** (Integer)
   - Type: Integer
   - Default: 0
   - Example: 8

8. **competitions_attending** (Relationship)
   - Type: Relationship
   - Required: No
   - Links to competitions collection

9. **theme** (String)
   - Type: String
   - Required: No
   - Example: "bg-orange-600"

### Recommended Additional Fields

To enhance the app functionality, consider adding these optional fields:

10. **history** (JSON)
    - Type: JSON
    - Required: No
    - Example: ["Founded in 2005", "Multiple-time qualifier"]

11. **achievements** (JSON)
    - Type: JSON
    - Required: No
    - Example: [{"name": "Raas All Stars 2023 - 2nd Place", "link": "https://www.youtube.com/watch?v=example"}]

12. **founded** (String)
    - Type: String
    - Required: No
    - Example: "2005"

## Sample Team Data

Here's an example of how to structure your team data in Directus:

```json
{
  "name": "Texas Raas",
  "university": "University of Texas at Austin",
  "bidpoints": 8,
  "theme": "bg-orange-600",
  "city": "Austin, TX",
  "instagramlink": "https://instagram.com/texasraas"
}
```

### Optional Enhanced Data

If you add the recommended fields, your data could look like:

```json
{
  "name": "Texas Raas",
  "university": "University of Texas at Austin",
  "bidpoints": 8,
  "theme": "bg-orange-600",
  "city": "Austin, TX",
  "instagramlink": "https://instagram.com/texasraas",
  "history": [
    "Founded in 2005, Texas Raas has been a powerhouse in collegiate Raas",
    "Multiple-time Raas All Stars qualifier",
    "Known for innovative choreography and strong storytelling"
  ],
  "achievements": [
    {"name": "Raas All Stars 2023 - 2nd Place", "link": "https://www.youtube.com/watch?v=example1"},
    {"name": "Raas All Stars 2022 - 4th Place", "link": "https://www.youtube.com/watch?v=example2"}
  ],
  "founded": "2005"
}
```

## Environment Variables

Make sure your `.env` file has the correct Directus configuration:

```env
VITE_DIRECTUS_URL=https://your-directus-instance.com
VITE_DIRECTUS_TOKEN=your-directus-token
```

## API Integration

The app will automatically fetch teams from your Directus `teams` collection using the `fetchTeams()` function in `src/lib/api.ts`. The function maps the Directus fields to the app's internal Team interface.

## Field Mapping

| Directus Field | App Field | Type | Notes |
|----------------|-----------|------|-------|
| `id` | `id` | string | Primary key |
| `name` | `name` | string | Team name |
| `university` | `university` | string | University name |
| `bidpoints` | `bidPoints` | number | Bid points earned |
| `theme` | `color` | string | Team color theme |
| `logo` | `logo` | string (URL) | Team logo image |
| `city` | - | string | Not used in app (available for future use) |
| `instagramlink` | - | string | Not used in app (available for future use) |
| `competitions_attending` | - | relationship | Not used in app (available for future use) |
| `qualified` | `qualified` | boolean | Auto-calculated (bidPoints >= 5) |
| `locked` | `locked` | boolean | Default: false (can be added to DB) |
| `history` | `history` | string[] | Default: [] (can be added to DB) |
| `achievements` | `achievements` | object[] | Default: [] (can be added to DB) |
| | | | Each achievement object has: `name` (string) and `link` (string, YouTube URL) |
| `founded` | `founded` | string | Default: "" (can be added to DB) |

## Testing

1. Add a few teams to your Directus `teams` collection
2. Start the development server: `npm run dev`
3. Navigate to the app and check the "Teams" tab
4. Verify that teams are loading correctly from the database

## Fallback

If the database connection fails, the app will fall back to the hardcoded team data to ensure the app continues to function. 