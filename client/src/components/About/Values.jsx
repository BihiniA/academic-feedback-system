import { Users, Target, Award, Brain, Sparkles, ChevronRight } from 'lucide-react';

const AcademicValues = () => {
  const values = [
    {
      icon: <Users className="h-8 w-8 text-indigo-600" />,
      title: "Student Focused",
      description: "Supporting students with personalized and meaningful academic feedback"
    },
    {
      icon: <Target className="h-8 w-8 text-indigo-600" />,
      title: "Intelligent Innovation",
      description: "Using AI technology to improve academic feedback and learning outcomes"
    },
    {
      icon: <Award className="h-8 w-8 text-indigo-600" />,
      title: "Academic Excellence",
      description: "Promoting continuous improvement through accurate and actionable feedback"
    }
  ];
  
  return (
    <div className="bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="max-w-7xl mx-auto px-4">

        <div className="text-center mb-10">
          <div className="flex justify-center items-center mb-2">
            <Brain className="h-5 w-5 text-indigo-500 mr-2" />

            <span className="text-indigo-600 font-medium uppercase tracking-wider text-sm">
              What Drives Us
            </span>
          </div>

          <h2 className="text-2xl md:text-3xl font-bold mb-2">
            Our Values
          </h2>

          <div className="w-20 h-1 bg-indigo-500 mx-auto"></div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          {values.map((value, index) => (
            <div
              key={index}
              className="text-center bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-6 transform hover:-translate-y-1"
            >

              <div className="inline-flex p-4 bg-indigo-100 rounded-full mb-4 shadow-inner">
                {value.icon}
              </div>

              <h3 className="text-lg font-semibold mb-2">
                {value.title}
              </h3>

              <p className="text-gray-600 mb-4">
                {value.description}
              </p>

              <a
                href="#"
                className="inline-flex items-center text-indigo-600 font-medium hover:text-indigo-700"
              >
                Learn more
                <ChevronRight className="h-4 w-4 ml-1" />
              </a>

            </div>
          ))}
        </div>
        
        <div className="flex justify-center mt-8">
          <div className="inline-flex items-center bg-indigo-50 px-5 py-2 rounded-full">
            <Sparkles className="h-4 w-4 text-indigo-600 mr-2" />

            <span className="text-indigo-800 font-medium">
              Empowering better learning through AI
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AcademicValues;