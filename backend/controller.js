require('dotenv').config();

async function getData(req, res) {
    try {
        const API_KEY = process.env.API_KEY;
        const code = req.body.code;
        const prompt = `
    Analyze this code.
    
    Return ONLY valid JSON.
    
    {
      "timeComplexity": "O(...)",
      "spaceComplexity": "O(...)",
      "explanation": "short explanation"
    }
    
    Code:
    
    ${code}
    `;

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [
                                {
                                    text: prompt
                                }
                            ]
                        }
                    ]
                })
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText);
        }

        const data = await response.json();

        const text =
            data?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!text) {
            throw new Error('Gemini returned an empty response.');
        }

        const match = text.match(/\{[\s\S]*\}/);

        if (!match) {
            throw new Error('Could not find JSON in Gemini response.');
        }

        const result = JSON.parse(match[0]);

        res.send(result);
    } catch (e) {
        console.error(e);
        res.status(500).json({
            error: e.message
        });
    }
}

module.exports = {
    getData
};