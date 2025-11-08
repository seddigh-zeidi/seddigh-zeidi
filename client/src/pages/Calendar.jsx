import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { FiCalendar } from 'react-icons/fi';

function Calendar() {
  const [calendar, setCalendar] = useState([]);
  const [loading, setLoading] = useState(false);
  const [days, setDays] = useState(30);

  useEffect(() => {
    fetchCalendar();
  }, []);

  const fetchCalendar = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/calendar');
      setCalendar(response.data.data);
    } catch (error) {
      toast.error('خطا در دریافت تقویم');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const response = await axios.post('/api/calendar/generate', { days });
      toast.success(response.data.message);
      fetchCalendar();
    } catch (error) {
      toast.error(error.response?.data?.error || 'خطا در ایجاد تقویم');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">تقویم محتوایی</h1>
          <p className="text-gray-600 mt-2">برنامه‌ریزی روزانه انتشار محتوا</p>
        </div>
      </div>

      <div className="card">
        <div className="flex items-end gap-4">
          <div className="flex-1">
            <label className="label">تعداد روزها</label>
            <input
              type="number"
              className="input"
              value={days}
              onChange={(e) => setDays(parseInt(e.target.value))}
              min="1"
              max="90"
            />
          </div>
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="btn btn-primary flex items-center gap-2"
          >
            <FiCalendar />
            {loading ? 'در حال ایجاد...' : 'ایجاد تقویم'}
          </button>
        </div>
      </div>

      {calendar.length > 0 && (
        <div className="space-y-4">
          {calendar.slice(0, 10).map((day, index) => (
            <div key={index} className="card">
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                {day.dateFormatted} - {day.dayOfWeek}
              </h3>
              <div className="space-y-2">
                {day.content.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <span className="text-sm text-gray-500">{idx + 1}.</span>
                      <span className="mr-2 font-medium">{item.title}</span>
                      {item.type === 'pillar' && (
                        <span className="mr-2 px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs">
                          Pillar
                        </span>
                      )}
                    </div>
                    <span className="text-sm text-gray-600">{item.category}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Calendar;
