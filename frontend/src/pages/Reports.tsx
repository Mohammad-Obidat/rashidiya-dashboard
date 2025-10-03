// src/pages/Reports.tsx
export default function ReportsPage() {
  return (
    <div className='p-6'>
      <h2 className='text-xl font-semibold mb-4'>التقارير</h2>
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
        <div className='bg-white p-4 rounded shadow'>
          <h3 className='font-medium mb-2'>تقرير شامل عن البرنامج</h3>
          <p className='text-sm text-gray-600'>
            ملخص شامل للطلاب، حضورهم، والمرشدين. زر \"معاينة\" لإنشاء تقرير قابل
            للتصدير.
          </p>
          <div className='mt-4 flex gap-2 justify-end'>
            <button className='px-3 py-2 border rounded'>معاينة</button>
            <button className='px-3 py-2 bg-gray-800 text-white rounded'>
              تصدير PDF
            </button>
          </div>
        </div>

        <div className='bg-white p-4 rounded shadow'>
          <h3 className='font-medium mb-2'>إحصائيات الحضور والغياب</h3>
          <p className='text-sm text-gray-600'>
            مخططات ونسب حضور شهرية وفصلية.
          </p>
          <div className='mt-4 flex gap-2 justify-end'>
            <button className='px-3 py-2 border rounded'>عرض</button>
          </div>
        </div>

        <div className='bg-white p-4 rounded shadow'>
          <h3 className='font-medium mb-2'>قوائم الطلاب المشاركة</h3>
          <p className='text-sm text-gray-600'>قوائم قابلة للتصفية والتصدير.</p>
          <div className='mt-4 flex gap-2 justify-end'>
            <button className='px-3 py-2 border rounded'>تصدير Excel</button>
          </div>
        </div>

        <div className='bg-white p-4 rounded shadow'>
          <h3 className='font-medium mb-2'>تقييم أداء البرنامج</h3>
          <p className='text-sm text-gray-600'>
            تلخيص جودة التنفيذ ومؤشرات الأداء.
          </p>
          <div className='mt-4 flex gap-2 justify-end'>
            <button className='px-3 py-2 border rounded'>عرض التفاصيل</button>
          </div>
        </div>
      </div>
    </div>
  );
}
