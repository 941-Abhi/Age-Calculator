import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Gift, Heart } from 'lucide-react';

interface AgeResult {
  years: number;
  months: number;
  days: number;
  totalDays: number;
  daysUntilNextBirthday: number;
  nextBirthday: string;
}

function App() {
  const [day, setDay] = useState<string>('');
  const [month, setMonth] = useState<string>('');
  const [year, setYear] = useState<string>('');
  const [result, setResult] = useState<AgeResult | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateInput = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    const currentYear = new Date().getFullYear();
    
    // Validate day
    const dayNum = parseInt(day);
    if (!day || dayNum < 1 || dayNum > 31) {
      newErrors.day = 'Enter a valid day (1-31)';
    }
    
    // Validate month
    const monthNum = parseInt(month);
    if (!month || monthNum < 1 || monthNum > 12) {
      newErrors.month = 'Enter a valid month (1-12)';
    }
    
    // Validate year
    const yearNum = parseInt(year);
    if (!year || yearNum < 1900 || yearNum > currentYear) {
      newErrors.year = `Enter a valid year (1900-${currentYear})`;
    }
    
    // Validate date exists
    if (day && month && year && !newErrors.day && !newErrors.month && !newErrors.year) {
      const birthDate = new Date(yearNum, monthNum - 1, dayNum);
      if (birthDate.getDate() !== dayNum || birthDate.getMonth() !== monthNum - 1) {
        newErrors.day = 'This date does not exist';
      }
      
      // Check if birth date is in the future
      if (birthDate > new Date()) {
        newErrors.general = 'Birth date cannot be in the future';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateAge = (): void => {
    if (!validateInput()) return;
    
    const birthDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    const today = new Date();
    
    let ageYears = today.getFullYear() - birthDate.getFullYear();
    let ageMonths = today.getMonth() - birthDate.getMonth();
    let ageDays = today.getDate() - birthDate.getDate();
    
    // Adjust for negative days
    if (ageDays < 0) {
      ageMonths--;
      const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
      ageDays += lastMonth.getDate();
    }
    
    // Adjust for negative months
    if (ageMonths < 0) {
      ageYears--;
      ageMonths += 12;
    }
    
    // Calculate total days lived
    const timeDiff = today.getTime() - birthDate.getTime();
    const totalDays = Math.floor(timeDiff / (1000 * 3600 * 24));
    
    // Calculate next birthday
    const nextBirthday = new Date(today.getFullYear(), parseInt(month) - 1, parseInt(day));
    if (nextBirthday < today) {
      nextBirthday.setFullYear(today.getFullYear() + 1);
    }
    
    const daysUntilNext = Math.ceil((nextBirthday.getTime() - today.getTime()) / (1000 * 3600 * 24));
    
    setResult({
      years: ageYears,
      months: ageMonths,
      days: ageDays,
      totalDays,
      daysUntilNextBirthday: daysUntilNext,
      nextBirthday: nextBirthday.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    calculateAge();
  };

  const resetForm = () => {
    setDay('');
    setMonth('');
    setYear('');
    setResult(null);
    setErrors({});
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mb-4">
            <Calendar className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Age Calculator</h1>
          <p className="text-gray-600 text-lg">Discover your exact age in years, months, and days</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Input Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
              <Clock className="w-6 h-6 mr-2 text-blue-500" />
              Enter Your Birth Date
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label htmlFor="day" className="block text-sm font-medium text-gray-700 mb-2">
                    Day
                  </label>
                  <input
                    type="number"
                    id="day"
                    value={day}
                    onChange={(e) => setDay(e.target.value)}
                    placeholder="DD"
                    min="1"
                    max="31"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      errors.day ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                  />
                  {errors.day && <p className="text-red-500 text-xs mt-1">{errors.day}</p>}
                </div>
                
                <div>
                  <label htmlFor="month" className="block text-sm font-medium text-gray-700 mb-2">
                    Month
                  </label>
                  <input
                    type="number"
                    id="month"
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                    placeholder="MM"
                    min="1"
                    max="12"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      errors.month ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                  />
                  {errors.month && <p className="text-red-500 text-xs mt-1">{errors.month}</p>}
                </div>
                
                <div>
                  <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-2">
                    Year
                  </label>
                  <input
                    type="number"
                    id="year"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    placeholder="YYYY"
                    min="1900"
                    max={new Date().getFullYear()}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      errors.year ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                  />
                  {errors.year && <p className="text-red-500 text-xs mt-1">{errors.year}</p>}
                </div>
              </div>
              
              {errors.general && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-red-700 text-sm">{errors.general}</p>
                </div>
              )}
              
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                  Calculate Age
                </button>
                
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all duration-200"
                >
                  Reset
                </button>
              </div>
            </form>
          </div>

          {/* Results Display */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            {result ? (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                  <Heart className="w-6 h-6 mr-2 text-red-500" />
                  Your Age Details
                </h2>
                
                {/* Main Age Display */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl text-white">
                    <div className="text-3xl font-bold">{result.years}</div>
                    <div className="text-sm opacity-90">Years</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-green-500 to-green-600 rounded-xl text-white">
                    <div className="text-3xl font-bold">{result.months}</div>
                    <div className="text-sm opacity-90">Months</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl text-white">
                    <div className="text-3xl font-bold">{result.days}</div>
                    <div className="text-sm opacity-90">Days</div>
                  </div>
                </div>
                
                {/* Additional Info */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <span className="text-gray-700 font-medium">Total Days Lived:</span>
                    <span className="text-2xl font-bold text-gray-800">{result.totalDays.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div className="flex items-center">
                      <Gift className="w-5 h-5 text-yellow-600 mr-2" />
                      <span className="text-yellow-800 font-medium">Next Birthday:</span>
                    </div>
                    <span className="text-yellow-800 font-semibold">
                      {result.daysUntilNextBirthday === 0 ? 'Today!' : `${result.daysUntilNextBirthday} days`}
                    </span>
                  </div>
                  
                  <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                    <p className="text-indigo-800 text-sm">
                      <strong>Next Birthday Date:</strong> {result.nextBirthday}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-500 mb-2">Ready to Calculate</h3>
                <p className="text-gray-400">Enter your birth date to see your age details</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="text-center mt-8 text-gray-500 text-sm">
          <p>Built with React, TypeScript, and Tailwind CSS</p>
        </div>
      </div>
    </div>
  );
}

export default App;