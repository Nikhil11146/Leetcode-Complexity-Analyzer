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
            'https://api.groq.com/openai/v1/chat/completions',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${API_KEY}`
                },
                body: JSON.stringify({
                    model: 'llama-3.3-70b-versatile',
                    messages: [
                        {
                            role: 'user',
                            content: prompt
                        }
                    ],
                    temperature: 0.2
                })
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText);
        }

        const data = await response.json();

        const text =
            data?.choices?.[0]?.message?.content;

        if (!text) {
            throw new Error('Groq returned an empty response.');
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