const startDate = new Date(2026, 7, 1);
const totalDays = 730;

const holidays = [
  ["Labor Day", "2026-09-07", "US transition from summer to fall routines"],
  ["Halloween", "2026-10-31", "visual absurdity, costumes, paid identity"],
  ["Thanksgiving", "2026-11-26", "gratitude, family attention, cultural rituals"],
  ["Black Friday", "2026-11-27", "commerce eats attention"],
  ["Cyber Monday", "2026-11-30", "internet buying behavior"],
  ["Christmas", "2026-12-25", "gift economy, brands, sentiment"],
  ["New Year", "2027-01-01", "fresh start, first backers, public scoreboard"],
  ["Valentine's Day", "2027-02-14", "love, messages, paid declarations"],
  ["Easter", "2027-03-28", "rebirth, strange resurrection of advertising"],
  ["Mother's Day", "2027-05-09", "paid dedications and emotional slots"],
  ["Memorial Day", "2027-05-31", "summer kickoff and American attention"],
  ["Father's Day", "2027-06-20", "personal messages and family slots"],
  ["Independence Day", "2027-07-04", "freedom, ownership, public message slots"],
  ["Labor Day", "2027-09-06", "US transition from summer to fall routines"],
  ["Halloween", "2027-10-31", "visual absurdity, costumes, paid identity"],
  ["Thanksgiving", "2027-11-25", "gratitude, family attention, cultural rituals"],
  ["Black Friday", "2027-11-26", "commerce eats attention"],
  ["Cyber Monday", "2027-11-29", "internet buying behavior"],
  ["Christmas", "2027-12-25", "gift economy, brands, sentiment"],
  ["New Year", "2028-01-01", "fresh start, first backers, public scoreboard"],
  ["Valentine's Day", "2028-02-14", "love, messages, paid declarations"],
  ["Easter", "2028-04-16", "rebirth, strange resurrection of advertising"],
  ["Mother's Day", "2028-05-14", "paid dedications and emotional slots"],
  ["Memorial Day", "2028-05-29", "summer kickoff and American attention"],
  ["Father's Day", "2028-06-18", "personal messages and family slots"],
  ["Independence Day", "2028-07-04", "freedom, ownership, public message slots"]
].map(([name, date, meaning]) => ({ name, date, meaning }));

const phases = [
  "Explain the concept",
  "Show the absurdity",
  "Sell a small slot",
  "Publish proof",
  "Answer objections",
  "Invite sponsors",
  "Investor signal"
];

const slotTypes = [
  "message slot",
  "pixel placement",
  "brand card",
  "sponsor frame",
  "creator cameo",
  "credit line",
  "premium scene"
];

const audiences = [
  "small US brands",
  "creator-led businesses",
  "restaurants and venues",
  "consumer startups",
  "local service companies",
  "early supporters",
  "investors and producers"
];

function addDays(date, days) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function iso(date) {
  return date.toISOString().slice(0, 10);
}

function diffDays(a, b) {
  return Math.round((b - a) / 86400000);
}

function campaignFor(date) {
  const windows = [120, 90, 60, 45, 30, 21, 14, 7, 3, 1, 0];
  return holidays
    .map((holiday) => {
      const target = new Date(`${holiday.date}T00:00:00`);
      return { ...holiday, daysOut: diffDays(date, target) };
    })
    .find((holiday) => windows.includes(holiday.daysOut));
}

function channelsFor(date, index) {
  const day = date.getDay();
  const channels = [];
  channels.push("X");
  if (day === 0 || day === 4) channels.push("Reddit");
  if (index % 3 === 1) channels.push("Story");
  if (day === 1 || day === 5) channels.push("Reel");
  if (day === 2 || day === 5) channels.push("IG Post");
  if (day === 3) channels.push("Facebook Essay");
  return channels;
}

function planDay(date, index) {
  const campaign = campaignFor(date);
  const phase = campaign ? (campaign.daysOut <= 14 ? "Campaign urgency" : "Campaign warmup") : phases[index % phases.length];
  const slot = slotTypes[index % slotTypes.length];
  const audience = audiences[index % audiences.length];
  const channels = channelsFor(date, index);
  const channelText = channels.length ? channels.join(" + ") : "Research / proof";
  const campaignText = campaign ? `${campaign.name}, ${campaign.daysOut} days out` : "evergreen sales cycle";
  const thesis = campaign
    ? `${campaign.name} is a cultural attention window. Connect the paid-place idea to ${campaign.meaning}.`
    : `Make ${audience} understand why a ${slot} inside the film is more memorable than a normal ad.`;

  return {
    date: iso(date),
    weekday: date.toLocaleDateString("en-US", { weekday: "short" }),
    month: date.toLocaleDateString("en-US", { month: "long", year: "numeric" }),
    channels,
    phase,
    slot,
    audience,
    campaign,
    title: `${channelText}: ${campaignText}`,
    thesis,
    storyPrompt: `Create 4 IG Story slides for ${audience}. Slide 1: ${campaign ? campaign.name : "attention problem"}. Slide 2: the film sells visible places. Slide 3: show a ${slot}. Slide 4: ask viewers to reply "slot".`,
    reelPrompt: `Write a 20-second Reel. First frame: "Your ad could literally be in the film." Show the ${slot}, the absurd anti-film premise, and one CTA to request a place.`,
    xPrompt: `Write one X post plus a 5-post thread for ${audience}. Explain ${thesis} Include one proof signal to track and end with a soft "DM slot" CTA.`,
    redditPrompt: `Write a Reddit discussion post for film/startup/advertising communities. Topic: ${thesis} Do not hard-sell. Ask for feedback on whether the premise is interesting, stupid, or commercially sharp.`,
    postPrompt: `Write an Instagram caption for ${audience}: explain ${thesis} End with "DM slot".`,
    investorNote: `Track whether ${audience} reacts to ${slot}. Evidence needed: replies, reservations, objections, and price feedback.`,
    kpi: channels.length ? "replies, saves, DMs, qualified sponsor leads, slot reservations" : "lead research, proof asset, objection log, investor evidence"
  };
}

const plans = Array.from({ length: totalDays }, (_, index) => planDay(addDays(startDate, index), index));

const monthSelect = document.querySelector("#monthSelect");
const typeFilter = document.querySelector("#typeFilter");
const planRows = document.querySelector("#planRows");
const visualTheme = document.querySelector("#visualTheme");
const visualPrompt = document.querySelector("#visualPrompt");
const freePreview = document.querySelector("#freePreview");

const months = [...new Set(plans.map((plan) => plan.month))];
months.forEach((month) => {
  const option = document.createElement("option");
  option.value = month;
  option.textContent = month;
  monthSelect.appendChild(option);
});

function badgeClass(channel) {
  if (channel === "Story") return "story";
  if (channel === "Reel") return "reel";
  if (channel === "X") return "x";
  if (channel === "Reddit") return "reddit";
  if (channel === "IG Post") return "post";
  if (channel === "Facebook Essay") return "fb";
  return "";
}

function shouldShow(plan) {
  if (typeFilter.value === "publishing") return plan.channels.length > 0;
  if (typeFilter.value === "investor") return plan.phase === "Investor signal" || plan.audience.includes("investors");
  if (typeFilter.value === "campaign") return Boolean(plan.campaign);
  return true;
}

function render() {
  const visible = plans.filter((plan) => plan.month === monthSelect.value && shouldShow(plan));
  planRows.innerHTML = "";

  visible.forEach((plan) => {
    const row = document.createElement("article");
    row.className = "plan-row";
    const channelBadges = plan.channels.length
      ? plan.channels.map((channel) => `<span class="badge ${badgeClass(channel)}">${channel}</span>`).join("")
      : `<span class="badge">Research</span>`;
    const campaignBadge = plan.campaign ? `<span class="badge fb">${plan.campaign.name}</span>` : "";

    row.innerHTML = `
      <div class="date">${plan.date}<span>${plan.weekday}</span></div>
      <div class="badges">${channelBadges}<span class="badge">${plan.phase}</span>${campaignBadge}</div>
      <div class="row-copy">
        <h3>${plan.title}</h3>
        <p>${plan.thesis}</p>
        <p><strong>Audience:</strong> ${plan.audience} · <strong>Slot:</strong> ${plan.slot}</p>
        <p><strong>KPI:</strong> ${plan.kpi}</p>
      </div>
      <div class="row-prompts">
        <p><strong>Story:</strong> ${plan.storyPrompt}</p>
        <p><strong>Reel:</strong> ${plan.reelPrompt}</p>
        <p><strong>X:</strong> ${plan.xPrompt}</p>
        <p><strong>Reddit:</strong> ${plan.redditPrompt}</p>
        <p><strong>Post:</strong> ${plan.postPrompt}</p>
        <p><strong>Investor:</strong> ${plan.investorNote}</p>
      </div>
    `;

    planRows.appendChild(row);
  });
}

function setStats() {
  document.querySelector("#totalDays").textContent = plans.length;
  document.querySelector("#storyTotal").textContent = plans.filter((plan) => plan.channels.includes("Story")).length;
  document.querySelector("#reelTotal").textContent = plans.filter((plan) => plan.channels.includes("Reel")).length;
  document.querySelector("#xTotal").textContent = plans.filter((plan) => plan.channels.includes("X")).length;
  document.querySelector("#redditTotal").textContent = plans.filter((plan) => plan.channels.includes("Reddit")).length;
  document.querySelector("#postTotal").textContent = plans.filter((plan) => plan.channels.includes("IG Post")).length;
  document.querySelector("#fbTotal").textContent = plans.filter((plan) => plan.channels.includes("Facebook Essay")).length;
  document.querySelector("#campaignTotal").textContent = plans.filter((plan) => plan.campaign).length;
}

monthSelect.addEventListener("change", render);
typeFilter.addEventListener("change", render);

function buildVisualPrompt(theme) {
  return [
    `Cinematic campaign preview for Your Ad Could Be Here: ${theme}.`,
    "A dark premium production room with a wall-sized content calendar, empty glowing sponsor slots inside film frames, smartphone screens for Stories, Reels, X and Reddit, and subtle US holiday campaign objects.",
    "The image must feel like a professional pitch deck asset for sponsors and investors: commercial, strategic, expensive, clear.",
    "Style: photorealistic cinematic advertising still, charcoal background, deep red and warm gold accents, realistic film production textures, clean analytics desk, no readable text, no fake logos, no watermark."
  ].join(" ");
}

function setVisualPrompt() {
  visualPrompt.value = buildVisualPrompt(visualTheme.value);
}

function generateFreeImage() {
  const prompt = encodeURIComponent(visualPrompt.value.trim());
  const seed = Math.floor(Math.random() * 100000);
  freePreview.src = `https://image.pollinations.ai/prompt/${prompt}?width=1024&height=576&seed=${seed}&nologo=true&enhance=true`;
}

visualTheme.addEventListener("change", setVisualPrompt);
document.querySelector("#generateFreeImage").addEventListener("click", generateFreeImage);

setStats();
setVisualPrompt();
render();
