import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ChevronDown, ChevronRight } from "lucide-react";

import { useTheme } from "../context/ThemeContext";
import VisualizationSlider from "../components/VisualizationSlider";
import VisualizationMobile from "../components/VisualizationMobile";
import ModalStart from "../components/ModalStart";
import FeatureDisplay from "../components/FeatureDisplay";
import ScoreboardTree from "../components/ScoreboardTree";
import ScoreboardRanking from "../components/ScoreboardRanking";

function HomePage() {
  const { theme } = useTheme();
  const [showMore, setShowMore] = useState(false);
  const { t } = useTranslation();
  const [matches, setMatches] = useState([]);
  const [scoreboard, setScoreboard] = useState(null);
  const [highlightedTeams, setHighlightedTeams] = useState([]);
  const [shareCode, setShareCode] = useState("");

  const scrollToFeatures = () => {
    document.getElementById("features")?.scrollIntoView({ behavior: "smooth" });
  };

  const imagesGeneral = [
    `/data/images/slide_${theme}_ranking.png`,
    `/data/images/slide_${theme}_matches.png`,
    `/data/images/slide_${theme}_tree.png`,
  ];

  const imagesTournament = [
    `/data/images/slide_${theme}_tournament_list.png`,
    `/data/images/slide_${theme}_tournament_general.png`,
    `/data/images/slide_${theme}_tournament_participants.png`,
  ];

  const imageMobile = `/data/images/mobile_${theme}.png`;

  const teamImages = {
    baptiste: "/data/images/team_baptiste.jpg",
    gwendal: "/data/images/team_gwendal.jpg",
  };

  const updateScores = () => {
    const teams = [...scoreboard.teams];
    if (teams.length < 2) return;

    const indices = [...Array(teams.length).keys()];
    const teamAIndex = indices.splice(Math.floor(Math.random() * indices.length), 1)[0];
    const teamBIndex = indices[Math.floor(Math.random() * indices.length)];
    const teamA = { ...teams[teamAIndex] };
    const teamB = { ...teams[teamBIndex] };

    let scoreA = Math.floor(Math.random() * 90);
    let scoreB = 90 - scoreA;

    if (scoreA === scoreB) {
      scoreA--;
      scoreB++;
    }

    let winnerId = null;
    let loserId = null;

    if (scoreA > scoreB) {
      teamA.victories += 1;
      teamB.defeats += 1;
      winnerId = teamA.id;
      loserId = teamB.id;
    } else {
      teamB.victories += 1;
      teamA.defeats += 1;
      winnerId = teamB.id;
      loserId = teamA.id;
    }

    teamA.total_score += scoreA;
    teamB.total_score += scoreB;

    const updatedTeams = [...teams];
    updatedTeams[teamAIndex] = teamA;
    updatedTeams[teamBIndex] = teamB;

    setScoreboard({ ...scoreboard, teams: updatedTeams });

    const newHighlights = [
      { id: winnerId, type: "won" },
      { id: loserId, type: "lost" },
    ];

    setHighlightedTeams(newHighlights);
    setTimeout(() => setHighlightedTeams([]), 1500);
  };

  const handleStart = () => {
    document.getElementById("modal-start").showModal();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!shareCode) return;
    window.location.href = `https://matchmaker.ovh/scoreboard/${shareCode}`;
  };

  useEffect(() => {
    fetch("/data/matches.json")
      .then((response) => response.json())
      .then(setMatches)
      .catch(console.error);

    fetch("/data/scoreboard.json")
      .then((response) => response.json())
      .then(setScoreboard)
      .catch(console.error);
  }, []);

  return (
    <div className="flex flex-col items-center text-center w-screen">
      {/* HERO SECTION */}
      <section className="relative min-h-screen flex flex-col md:flex-row items-center justify-center md:justify-between px-10 md:px-24 gap-16 md:gap-20 w-11/12">
        <div className="flex-1 max-w-2xl text-left flex flex-col justify-center">
          <h1 className="text-4xl md:text-6xl font-bold text-primary mb-6 leading-tight">
            {t("hero_title")}
          </h1>

          <p className="text-lg text-gray-500 leading-relaxed mb-4">
            {t("hero_subtitle")}
          </p>

          <div className="mt-2">
            {!showMore ? (
              <button
                onClick={() => setShowMore(true)}
                className="text-sm text-primary font-semibold hover:underline focus:outline-none"
              >
                {t("learn_more")}
              </button>
            ) : (
              <div className="mt-3 text-gray-500 text-base leading-relaxed max-w-prose">
                <p className="text-justify">{t("hero_description")}</p>
                <button
                  onClick={() => setShowMore(false)}
                  className="mt-4 text-sm text-primary font-semibold hover:underline focus:outline-none"
                >
                  {t("show_less")}
                </button>
              </div>
            )}
          </div>

          <div className="flex justify-center mt-4 md:justify-start">
            <button
              onClick={handleStart}
              className="btn border border-base-300 flex items-center gap-2 mt-8 px-6 py-6 rounded-full cursor-pointer bg-primary text-white text-xl font-semibold hover:bg-primary/90 transition"
            >
              {t("get_started")}
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        <div className="flex-1 w-full justify-end hidden lg:block">
          <VisualizationSlider theme={theme} images={imagesGeneral} duration={3000} />
        </div>

        <ModalStart
          id="modal-start"
          shareCode={shareCode}
          setShareCode={setShareCode}
          onSubmit={handleSubmit}
          onNavigate={() => (window.location.href = "https://matchmaker.ovh/tournaments")}
        />

        <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 animate-bounce cursor-pointer">
          <ChevronDown
            size={48}
            onClick={scrollToFeatures}
            className="text-gray-400 hover:text-primary transition"
          />
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section
        id="features"
        className="flex flex-col items-center py-32 px-8 w-full max-w-6xl space-y-8 md:space-y-40"
      >
        <div className="flex items-center justify-center my-12 w-full mb-8 md:mb-24">
          <div className="border-t border-base-content/70 flex-grow mx-4" />
          <h2 className="text-4xl font-bold text-base-content/70 text-center whitespace-nowrap">
            {t("features_title")}
          </h2>
          <div className="border-t border-base-content/70 flex-grow mx-4" />
        </div>

        <FeatureDisplay
          title={t("feature_title_tournament")}
          description={t("feature_description_tournament")}
          icon="tournament"
          component={<VisualizationSlider theme={theme} images={imagesTournament} duration={4500} />}
          direction="right"
        />

        <FeatureDisplay
          title={t("feature_title_bracket")}
          description={t("feature_description_bracket")}
          icon="bracket"
          component={<ScoreboardTree matches={matches} totalRounds={2} />}
          direction="left"
        />

        <FeatureDisplay
          title={t("feature_title_sharing")}
          description={t("feature_description_sharing")}
          icon="sharing"
          component={<VisualizationMobile scale={66} image={imageMobile} />}
          direction="right"
        />

        <FeatureDisplay
          title={t("feature_title_scores")}
          description={t("feature_description_scores")}
          icon="scores"
          component={<ScoreboardRanking scoreboard={scoreboard} highlightedTeams={highlightedTeams} />}
          button={{ text: t("update_scores"), action: updateScores }}
          direction="left"
        />
      </section>

      {/* ABOUT SECTION */}
      <section id="about" className="w-full max-w-6xl py-24 px-8 md:px-12 text-base-content">
        <div className="flex items-center justify-center my-12 w-full mb-12 md:mb-24">
          <div className="border-t border-base-content/70 flex-grow mx-4" />
          <h2 className="text-4xl font-bold text-base-content/70 text-center whitespace-nowrap">
            {t("about_title")}
          </h2>
          <div className="border-t border-base-content/70 flex-grow mx-4" />
        </div>

        <p className="text-justify text-lg text-base-content/70 max-w-xs md:max-w-4xl mx-auto mb-16 leading-relaxed">
          {t("about_description")}
        </p>

        <div className="bg-base-100/50 backdrop-blur-2xl rounded-4xl inset-shadow-sm/15 md:mx-24 py-8 mb-20">
          <div className="relative text-left border-l border-primary max-w-4xl pl-12 mx-8 md:mx-12">
            {[
              { dates: "Aug. 18 - Sep. 28 2025", title: t("about_title_idea"), description: t("about_description_idea") },
              { dates: "Sep. 29 - Oct. 26 2025", title: t("about_title_prototype"), description: t("about_description_prototype") },
              { dates: "Oct. 27 - Nov. 02 2025", title: t("about_title_release"), description: t("about_description_release") },
            ].map((period, index) => (
              <div key={index} className="my-8">
                <div className="absolute -left-[9px] w-4 h-4 rounded-full bg-primary" />
                <p className="text-sm font-medium text-primary">{period.dates}</p>
                <h3 className="text-xl font-semibold mt-1">{period.title}</h3>
                <p className="text-base-content/70 mt-1">{period.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* TEAM SECTION */}
        <div className="flex flex-col md:flex-row items-center justify-evenly">
          {[
            {
              name: "Baptiste Lonqueu",
              github: "https://github.com/lnqbat",
              linkedin: "https://linkedin.com/in/baptiste-lonqueu-9a9b79202",
              image: teamImages.baptiste,
              role: "Backend & Deployment",
            },
            {
              name: "Gwendal Minguy-Pèlerin",
              github: "https://github.com/gwendalminguy",
              linkedin: "https://linkedin.com/in/gwendalminguy",
              image: teamImages.gwendal,
              role: "Frontend & UX Design",
            },
          ].map((member, index) => (
            <div key={index} className="flex flex-col items-center text-center space-y-2 mb-12">
              <div className="w-32 h-32 border border-base-300 rounded-full bg-base-100 p-1.5 mb-3">
                <img src={member.image} className="rounded-full" alt={member.name} />
              </div>
              <h3 className="text-lg font-semibold">{member.name}</h3>
              <p className="text-sm text-base-content/70">{member.role}</p>
              <div className="flex mt-4 border border-primary rounded-full">
                <a
                  href={member.github}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 text-primary font-semibold rounded-l-full hover:bg-primary hover:text-white transition-colors duration-300"
                >
                  GitHub
                </a>
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 text-primary font-semibold rounded-r-full hover:bg-primary hover:text-white transition-colors duration-300"
                >
                  LinkedIn
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default HomePage;
