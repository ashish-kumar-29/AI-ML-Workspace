export default function HeroSection() {
  return (
    <section className="text-center mb-12 relative z-10">


      {/* Badge */}

      <div
        className="
        inline-block
        px-5
        py-2
        rounded-full
        bg-cyan-400/10
        border
        border-cyan-400/30
        text-cyan-300
        font-semibold
        text-sm
        mb-6
        shadow-lg
        "
      >

        🚀 AI Powered Machine Learning Platform

      </div>





      {/* Heading */}


      <h1
        className="
        text-6xl
        font-extrabold
        bg-gradient-to-r
        from-cyan-300
        via-blue-400
        to-purple-400
        bg-clip-text
        text-transparent
        "
      >

        DataMind AI

      </h1>






      {/* Tagline */}


      <p
        className="
        text-2xl
        text-white
        mt-6
        font-medium
        "
      >

        Analyze • Visualize • Train Models

      </p>






      {/* Description */}


      <p
        className="
        text-gray-300
        mt-5
        max-w-3xl
        mx-auto
        leading-8
        text-lg
        "
      >

        Upload your datasets, explore detailed statistics,
        visualize insights, and build machine learning models —
        all from one modern AI workspace.

      </p>






      {/* Feature Cards */}


      <div
        className="
        flex
        justify-center
        gap-6
        mt-10
        flex-wrap
        "
      >



        <div
          className="
          bg-white/5
          backdrop-blur-xl
          border
          border-cyan-400/20
          text-white
          shadow-xl
          rounded-xl
          px-8
          py-5
          hover:scale-105
          transition
          "
        >

          📂 CSV Upload

        </div>





        <div
          className="
          bg-white/5
          backdrop-blur-xl
          border
          border-blue-400/20
          text-white
          shadow-xl
          rounded-xl
          px-8
          py-5
          hover:scale-105
          transition
          "
        >

          📊 Data Analytics

        </div>






        <div
          className="
          bg-white/5
          backdrop-blur-xl
          border
          border-purple-400/20
          text-white
          shadow-xl
          rounded-xl
          px-8
          py-5
          hover:scale-105
          transition
          "
        >

          🤖 ML Models

        </div>



      </div>



    </section>
  );
}