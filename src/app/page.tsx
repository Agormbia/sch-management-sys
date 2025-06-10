import Link from 'next/link'
import Image from 'next/image'

const Homepage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <Image src="/logo.png" alt="School Logo" width={40} height={40} />
            <span className="ml-2 text-xl font-semibold text-gray-800">School Dashboard</span>
          </div>
          <Link href="/sign-in" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
            Sign In
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
            School Management System
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Streamline your educational institution&#39;s operations with our comprehensive dashboard system.
          </p>
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            <Link href="/sign-in" className="flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10">
              Get Started
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-24 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { 
              title: 'Student Management', 
              icon: '/student.png', 
              description: 'Manage student records, attendance, and performance.',
              link: '/sign-in'
            },
            { 
              title: 'Teacher Portal', 
              icon: '/teacher.png', 
              description: 'Tools for teachers to manage classes and assessments.',
              link: '/sign-in'
            },
            { 
              title: 'Attendance Tracking', 
              icon: '/attendance.png', 
              description: 'Digital attendance management system.',
              link: '/sign-in'
            },
            { 
              title: 'Exam Management', 
              icon: '/exam.png', 
              description: 'Schedule and manage examinations efficiently.',
              link: '/sign-in'
            },
            { 
              title: 'Announcements', 
              icon: '/announcement.png', 
              description: 'Keep everyone informed with important updates.',
              link: '/sign-in'
            },
          ].map((feature, index) => (
            <Link href={feature.link} key={index} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center">
                <Image src={feature.icon} alt={feature.title} width={24} height={24} className="w-6 h-6" />
                <h3 className="ml-2 text-lg font-medium text-gray-900">{feature.title}</h3>
              </div>
              <p className="mt-2 text-gray-500">{feature.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Homepage