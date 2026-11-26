import NavigationBar from "@/team/components/layout/NavigationBar";
import TeamHeaderBehaviour from "./TeamHeaderBehaviour";
import "@/team/team-globals.css";

/**
 * The team site's fixed header (abhishekps-web/vajiram-ravi, its NavigationBar, copied as it is into src/team) for our own
 * pages (26 Nov 2026, the user: "use the fixed header from Abhishek's repo in our design"): Free resources and the course
 * finder. Only the header sits in the team's scope (.team-scope, its global rules), so the page under it keeps its own
 * styles. Its behaviours start after hydration (TeamHeaderBehaviour). The About page has it through its own AboutBehaviour.
 */
export default function TeamHeader() {
  return (
    <>
      <div className="team-scope team-header">
        <NavigationBar />
      </div>
      <TeamHeaderBehaviour />
    </>
  );
}
