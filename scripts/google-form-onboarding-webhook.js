/**
 * ============================================================================
 * UPTECH CONSULTING & OUTSOURCING
 * Google Apps Script: Profile Marketing Client Onboarding Webhook
 * ============================================================================
 */

// --- CONFIGURATION -----------------------------------------------------------
const WEBHOOK_URL = "https://uptechoutsourcing.com/api/onboarding-webhook";
const WEBHOOK_SECRET = "b021704f460a07c95154dd0c7e82b40583b546ec0b8d83e456416e3be4c0342f";
// -----------------------------------------------------------------------------

/**
 * Trigger handler for Google Form or Google Sheet submission.
 */
function onFormSubmit(e) {
  try {
    const payload = extractFormData(e);
    
    const options = {
      method: "post",
      contentType: "application/json",
      headers: {
        "x-webhook-secret": WEBHOOK_SECRET
      },
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    };

    const response = UrlFetchApp.fetch(WEBHOOK_URL, options);
    const statusCode = response.getResponseCode();
    const responseText = response.getContentText();

    Logger.log("Webhook response code: " + statusCode);
    Logger.log("Webhook response text: " + responseText);

    if (statusCode < 200 || statusCode >= 300) {
      console.error("Failed to forward onboarding response: " + statusCode + " - " + responseText);
    } else {
      console.log("Successfully sent onboarding submission to Uptech dashboard.");
    }
  } catch (error) {
    console.error("Error executing onFormSubmit: " + error.toString());
  }
}

/**
 * Extracts and maps answers from Google Form or Google Sheet into the Uptech API schema.
 */
function extractFormData(e) {
  const answers = {};
  let respondentEmail = "";

  if (e && e.response) {
    // Event from Google Form
    respondentEmail = e.response.getRespondentEmail ? e.response.getRespondentEmail() : "";
    const itemResponses = e.response.getItemResponses();
    for (let i = 0; i < itemResponses.length; i++) {
      const item = itemResponses[i];
      const title = item.getItem().getTitle().trim();
      const val = item.getResponse();
      answers[title] = formatValue(val);
    }
  } else if (e && e.namedValues) {
    // Event from Google Sheet
    for (const key in e.namedValues) {
      const rowVal = e.namedValues[key];
      answers[key.trim()] = Array.isArray(rowVal) && rowVal[0] ? String(rowVal[0]).trim() : String(rowVal || "").trim();
    }
    respondentEmail = answers["Email Address"] || answers["Email address"] || answers["Username"] || "";
  } else {
    throw new Error("No event data received. Run this via a Form Submit trigger.");
  }

  // Exact & Fuzzy finder
  function findField(searchTerms, defaultValue = "") {
    // 1. Try exact match first
    for (const key in answers) {
      for (let i = 0; i < searchTerms.length; i++) {
        if (key.trim().toLowerCase() === searchTerms[i].toLowerCase() && answers[key]) {
          return answers[key];
        }
      }
    }
    // 2. Try partial includes
    for (const key in answers) {
      const lower = key.toLowerCase();
      for (let i = 0; i < searchTerms.length; i++) {
        if (lower.includes(searchTerms[i].toLowerCase()) && answers[key]) {
          return answers[key];
        }
      }
    }
    return defaultValue;
  }

  // Specific reference finder matching "(1)", "(2)", "(3)" or "Reference 1", etc.
  function getReference(num) {
    const numTag = `(${num})`;
    const refTag = `reference ${num}`;
    const refTagAlt = `ref ${num}`;

    function findRefValue(subPatterns) {
      for (const key in answers) {
        const lower = key.toLowerCase();
        const matchesRef = lower.includes(numTag) || lower.includes(refTag) || lower.includes(refTagAlt);
        if (matchesRef) {
          for (let i = 0; i < subPatterns.length; i++) {
            if (lower.includes(subPatterns[i].toLowerCase()) && answers[key]) {
              return answers[key];
            }
          }
        }
      }
      return "";
    }

    return {
      name: findRefValue(["full name", "name"]),
      titleAndCompany: findRefValue(["job title & company", "job title", "title & company", "company", "title"]),
      relationship: findRefValue(["professional relationship", "relationship", "relation"]),
      email: findRefValue(["email address", "email"]),
      phone: findRefValue(["phone number", "phone", "contact"])
    };
  }

  // File URL formatter (handles Drive URLs or raw File IDs)
  function formatDriveUrl(val) {
    if (!val || val === "") return undefined;
    const str = String(val).trim();
    if (str.startsWith("http://") || str.startsWith("https://")) {
      return str.split(",")[0].trim();
    }
    // If it's a raw Drive file ID (alphanumeric string)
    if (/^[a-zA-Z0-9_-]{20,}$/.test(str)) {
      return "https://drive.google.com/open?id=" + str;
    }
    return str || undefined;
  }

  // Normalize date of birth to YYYY-MM-DD
  function parseDob(val) {
    if (!val || val === "") return "2000-01-01";
    if (val instanceof Date) {
      return Utilities.formatDate(val, "GMT", "yyyy-MM-dd");
    }
    const str = String(val).trim();
    const d = new Date(str);
    if (!isNaN(d.getTime())) {
      return Utilities.formatDate(d, "GMT", "yyyy-MM-dd");
    }
    return str;
  }

  const rawResume = findField([
    "Upload Resume (Editable)",
    "upload resume",
    "resume",
    "cv"
  ]);
  
  const rawPhoto = findField([
    "Upload a professional picture for linkedin profile",
    "picture for linkedin",
    "linkedin profile",
    "professional picture",
    "photo",
    "picture",
    "headshot"
  ]);

  return {
    firstName: findField(["First Name (Given Name)", "first name", "firstname"], "N/A"),
    lastName: findField(["Last Name (Surname, Family Name)", "last name", "lastname", "surname"], "N/A"),
    gender: findField(["Gender", "gender"], "N/A"),
    contact: findField(["Contact", "phone number", "phone", "mobile"], "N/A"),
    email: findField(["Email", "email address"], respondentEmail || "N/A"),
    emailPassword: findField(["Email Password (Provide Email Password if you would like us to use the provided email for marketing)", "email password"]) || undefined,
    linkedinEmail: findField(["Linkedin Email:", "linkedin email", "linkedin username", "linkedin"], "N/A"),
    linkedinPassword: findField(["Linkedin Password:", "linkedin password"], "N/A"),
    address: findField(["Current Address, CIy, State, Zipcode, Country", "current address", "address", "location"], "N/A"),
    dateOfBirth: parseDob(findField(["Date of Birth", "date of birth", "dob"])),
    nationality: findField(["Nationality", "nationality", "country"], "N/A"),
    ethnicity: findField(["What is your Ethnicity (White, Black or African American, Asian) ?", "ethnicity", "race"], "N/A"),
    residencyStatus: findField(["Current Country Resident Status", "resident status", "residency", "work authorization"], "N/A"),
    securityClearance: findField(["Do you have an Active Security Clearance ?", "security clearance", "clearance"], "None"),
    preferredJobTitles: findField(["Prefered job Titles", "preferred job titles", "job titles", "target title"], "N/A"),
    preferredJobLocation: findField(["Prefered Job Location", "preferred job location", "job location", "target location"], "Remote"),
    expectedSalaryRange: findField(["Expected Annual Salary Range ($0K - $0k)", "salary range", "salary", "compensation"], "N/A"),
    resumeUrl: formatDriveUrl(rawResume),
    linkedinPhotoUrl: formatDriveUrl(rawPhoto),
    reference1: getReference(1),
    reference2: getReference(2),
    reference3: getReference(3),
    googleResponseEmail: respondentEmail || undefined,
    submittedAt: new Date().toISOString()
  };
}

/**
 * Format answer values (handles file uploads, arrays, dates)
 */
function formatValue(val) {
  if (Array.isArray(val)) {
    return val.map(function(v) {
      if (typeof v === "string" && /^[a-zA-Z0-9_-]{20,}$/.test(v.trim())) {
        return "https://drive.google.com/open?id=" + v.trim();
      }
      return v;
    }).join(", ");
  }
  if (typeof val === "string") return val.trim();
  if (val instanceof Date) return Utilities.formatDate(val, "GMT", "yyyy-MM-dd");
  return val ? String(val) : "";
}

/**
 * Test function to verify the connection with the exact field names.
 */
function testSendToDashboard() {
  const testPayload = {
    firstName: "Edwin",
    lastName: "Ndzi",
    gender: "Male",
    contact: "2672287902",
    email: "edwinndzi23@gmail.com",
    emailPassword: "Degrassi23",
    linkedinEmail: "edwinndzi23@gmail.com",
    linkedinPassword: "degrassi3",
    address: "1215 Kinder Sky Lane, Rosharon, TX, 77583",
    dateOfBirth: "1978-07-13",
    nationality: "USA",
    ethnicity: "Black or African American",
    residencyStatus: "US Citizen",
    securityClearance: "No",
    preferredJobTitles: "Senior Scrum Master, Agile Delivery Lead, IT Project Manager / Change Manager",
    preferredJobLocation: "Onsite, Hybrid, Remote, Preferably fully remote",
    expectedSalaryRange: "105k - 150k",
    resumeUrl: "https://drive.google.com/open?id=1DtaRQdDwf5K6y_ZtMhITbJW9OHpF9rgf",
    linkedinPhotoUrl: "https://drive.google.com/open?id=1KOIK0E9irL3Z9jCOLPj4FrE1G79PYYla",
    reference1: {
      name: "Justin Chambers",
      titleAndCompany: "Agile Manager, Universal Weather and Aviation",
      relationship: "Manager",
      email: "jchambers@univ-wea.com",
      phone: "7133219892"
    },
    reference2: {
      name: "Franklin Wanzi",
      titleAndCompany: "Software Manager, Universal Health Services",
      relationship: "Manager",
      email: "not sure",
      phone: "4703639314"
    },
    reference3: {
      name: "Ethan Dobbs",
      titleAndCompany: "QA Manager, Universal Weather and Aviation",
      relationship: "co-worker",
      email: "edobbs@univ-wea.com",
      phone: "8045513050"
    },
    googleResponseEmail: "edwinndzi23@gmail.com",
    submittedAt: new Date().toISOString()
  };

  const options = {
    method: "post",
    contentType: "application/json",
    headers: {
      "x-webhook-secret": WEBHOOK_SECRET
    },
    payload: JSON.stringify(testPayload),
    muteHttpExceptions: true
  };

  const response = UrlFetchApp.fetch(WEBHOOK_URL, options);
  Logger.log("Test Status Code: " + response.getResponseCode());
  Logger.log("Test Response: " + response.getContentText());
}
