import Image from "next/image";
import compAnalysis from "./comp-analysis.png";
import one from "./one.png";
import two from "./two.png";

function Link({ text, href }: { text: string, href: string }) {
  return <a className="text-dark-blue cursor:pointer hover:opacity-70 underline" target="_blank" href={href}>{text}</a>
}

export default function Handin() {
  return (
    <div className="c-column">
      <main className="l-column p-36 gap-36 max-w-[80vw]">
        <h1 className="text-32 font-bold"> Creating a <Link href="/" text="Pokémon Team Builder" /> in React </h1>

        <section className="l-column gap-14">
          <h2 className="text-20 font-bold"> Context </h2>
          <p className="text-14">
            In CSCI 1300, we&apos;ve spent a lot of time learning about design principles, user testing/research, and the iterative design process.
            At this stage of the course, we now are developing our front-end knowledge and skills, particularly with React.
          </p>

          <p className="text-14">
            To practice creating an interactive interface with components tied to internal data state (and even external API calls!),
            I designed and developed a personal Pokémon Team builder, where users can choose Pokémon to create as many teams as they want,
            and view the overall statistics for each team, all of which is supported by search, sorting, and filtering features.
          </p>
        </section>

        <section className="l-column gap-14">
          <h2 className="text-20 font-bold"> Part I: Competitive Analysis </h2>
          <p className="text-14">
            As I was brainstorming different features for the team builder, I looked at 3 other websites which supported some favoriting feature — <Link text="YouTube" href="https://www.youtube.com" />, <Link text="Amazon" href="https://www.amazon.com" />, and <Link text="Courses @ Brown" href="https://cab.brown.edu/"/> — to
            compare and contrast how each product handled the implementation of that feature and what functionality is offered to the user to interact with.
          </p>

          <p className="text-14"> I created a chart to capture these similarities and differences as follows: </p>
          <Image src={compAnalysis} className="p-24 rounded border border-black" width={800} alt="Competitive Analysis of Youtube, Amazon, Courses @ Brown"/>

          <div className="text-14">
            <p> In summary: </p>
            <ul className="list-disc list-inside">
              <li> All of these sites offer basic favoriting features, but it was interesting to see that they also all allowed the user to create as many carts/lists as desired. </li>
              <li> However, once created, only YouTube and Amazon allowed users to sort their carts by some factors (e.g. date added), and only Amazon allowed users to filter their carts for certain factors (e.g. purchased already). </li>
              <li> On another note, both YouTube and Amazon allow for easy sharing of a cart/wishlist, but only YouTube allows for other users to edit a personal cart/playlist, which Courses@Brown and Amazon do not allow. </li>
              <li> Overall, I actually thought that despite limited features, Courses @ Brown had an intuitive way to add to cart, with good text size and color contrast on the buttons to view/add to cart. </li>
              <li> YouTube was also mostly successful as an interface, although the functionality to add/save to playlists can be hard to find at first since they are hidden behind dropdowns only accessible through generic/unlabeled hamburger icons. </li>
              <li> Amazon overall was fine — the interface itself was quite cluttered, which made it difficult to locate the smaller buttons for creating/viewing wishlists. </li>
            </ul>
          </div>

          <p className="text-14"> 
            From this competitive analysis and market research, I determined that creating multiple carts/teams with custom names would be an important feature to support,
            along with the ability to sort/filter items that users will be looking through. If I had more time, it would have been nice to 
            create a feature to allow users to easily share their teams with other users.
          </p>
        </section>

        <section className="l-column gap-14">
          <h2 className="text-20 font-bold"> Part II: Development </h2>

          <p className="text-14"> The finalized Pokémon Team Builder is shown below: </p>
          <Image src={one} className="p-24 rounded border border-black" width={1200} alt="Image of team builder"/>

          <p className="text-14">
            You can see that there is various filtering, sorting, and searching available to classify various Pokémon.
            
            In this example, only Generation IV pokemon are considered by the filter, and they are sorted by their Pokédex entry in that generation.
          </p>

          <p className="text-14">
            Lastly, if you scroll down a bit from the team, you can see the aggregated statistics for your team, to see the
            highest value for each stat category (e.g. HP or attack) for your team!
          </p>

          <Image src={two} className="p-24 rounded border border-black" width={300} alt="Image of team overview" />

          <p className="text-14">
            To test out some of the other features, such as toggling between multiple teams or using more than one filter at once, visit
            the <Link text="Team Builder" href="/" /> directly!
          </p>
        </section>
      </main>
    </div>
  )
}