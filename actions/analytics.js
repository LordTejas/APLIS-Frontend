import { getPlainSubmissionsByUserId } from "./submissions";

export const getSmartFeedback = async (userId) => {
  try {
    const submissions = await getPlainSubmissionsByUserId(userId);

    // Get structured feedback from Gemini
    const geminiApiKey = process.env.GEMINI_API_KEY;
    const geminiApiUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=" + geminiApiKey;  

    const submissionsArray = submissions.map(submission => ({ "text": submission }));
    const submissionJson = JSON.stringify(submissionsArray, null, 2);

    const prompt = `
    You are a teacher. You are given a list of student submissions to a quiz.
    The more submissions you have just give a general feedback.
    The submissios have contentType "CONTENT" - more they have these type mean better (this are reading materials and video lectures)
    contentType "ASSIGNMENT" & "QUIZ" - Check the data fields of these and come to conclusions.

    Make sure to give a dummy generalized feedback with some ratings and comments.
    
    If they don't have any submissions then give a dummy feedback with some ratings and comments.

    Here are the submissions:
    ${submissionJson}
    `

    const response = await fetch(geminiApiUrl, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "contents": [
          {
            "parts": [{
              "text": prompt
            }]
          }
        ]
      })
    });

    const data = await response.json();

    const text = data.candidates[0].content.parts[0].text;

    return text;

  } catch (error) {
    console.error("Error fetching smart feedback:", error);
    throw new Error("Failed to fetch smart feedback");
  }
};
