/*
  HAUNTED HANOI — SETTINGS
  Edit only this file to connect the registration form and analytics.
  Step-by-step instructions are in HUONG-DAN.md (Vietnamese).
*/
window.HH_CONFIG = {
  /* ---------- Contact (shown on the site and used for the email fallback) ---------- */
  email: "hoangbaongan020509@gmail.com",

  /* ---------- Analytics: GoatCounter (free, no cookies) ----------
     1) Sign up at https://www.goatcounter.com  2) choose a site code, e.g. "hauntedhanoi"
     3) put ONLY that code below. Leave "" to turn analytics off. */
  goatcounter: "",

  /* ---------- Registration form -> Google Form -> Google Sheet ----------
     action: the form's "formResponse" address, e.g.
       https://docs.google.com/forms/d/e/1FAIpQLSxxxxxxxxxxxx/formResponse
     fields: the "entry.NNNNNNNNNN" id of each question in your Google Form.
     Leave action as "" and the form will open the visitor's email app instead. */
  form: {
    action: "",
    fields: {
      name:          "",  // Full name
      email:         "",  // Email
      phone:         "",  // Phone / Zalo
      instagram:     "",  // Instagram
      contactMethod: "",  // Preferred way to be contacted
      groupSize:     "",  // Number of people
      timeframe:     "",  // Rough timing
      language:      "",  // Walk language
      origin:        "",  // Where visiting from
      interest:      "",  // What draws you to this walk
      needs:         "",  // Anything to know (access, sensitivities)
      heardFrom:     "",  // How did you hear about us
      updates:       "",  // Wants occasional updates (Yes/No)
      consent:       "",  // Agreed to guidelines + being contacted (Yes)
      uiLang:        ""   // Language of the site when they signed up (optional)
    }
  }
};
