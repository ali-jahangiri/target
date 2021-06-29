import useFetch from "../Providers/useFetch";

const Home = () => {
  const fetcher = useFetch();
  const fetchData = () => {
    fetcher.get("https://api.artsy.net/api/shows").then(({ data }) => {
      console.log(data);
    });
  };
  return (
    <div>
      <button onClick={fetchData}>click me</button>
      Assumenda amet sit aut exercitationem et ut. Consequatur sapiente in omnis
      tempore repellendus velit voluptatem. Expedita repudiandae ad. Placeat et
      quia. Illum officia ipsa maxime odio aut. Nesciunt fugiat aspernatur.
      Exercitationem veniam rem et sunt nobis tenetur quisquam. Modi ea quos est
      perspiciatis impedit iusto eaque ad. Blanditiis minus distinctio rerum
      veniam eveniet necessitatibus porro. Ut similique error. Voluptas nemo
      enim dolor possimus et sed unde. A iure non ut dolores eligendi est
      numquam. Rerum rerum ea. Eum repellendus et. Quis quidem doloremque sint
      ipsa enim laboriosam. Tempore voluptatem earum soluta est ex et aspernatur
      est modi. Architecto inventore et sunt est ab provident ea possimus.
    </div>
  );
};

export default Home;
