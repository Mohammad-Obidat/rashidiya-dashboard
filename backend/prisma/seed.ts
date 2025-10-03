import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  await prisma.attendanceRecord.deleteMany();
  await prisma.session.deleteMany();
  await prisma.studentProgram.deleteMany();
  await prisma.advisorAssignment.deleteMany();
  await prisma.student.deleteMany();
  await prisma.program.deleteMany();
  await prisma.advisor.deleteMany();

  // ====== Advisors ======
  const advisor1 = await prisma.advisor.create({
    data: {
      name: 'أحمد محمد',
      phone: '+966500000001',
      email: 'ahmed@school.com',
    },
  });

  const advisor2 = await prisma.advisor.create({
    data: {
      name: 'محمد عبدالله',
      phone: '+966500000002',
      email: 'fatima@school.com',
    },
  });

  // ====== Programs ======
  const program1 = await prisma.program.create({
    data: {
      name: 'برنامج التميز العلمي',
      type: 'SCIENTIFIC',
      status: 'ACTIVE',
      description: 'برنامج لدعم الطلاب المتميزين علمياً',
      currentAdvisorId: advisor1.id,
    },
  });

  const program2 = await prisma.program.create({
    data: {
      name: 'برنامج الأنشطة الرياضية',
      type: 'SPORTS',
      status: 'ACTIVE',
      description: 'برنامج للأنشطة الرياضية والبدنية',
      currentAdvisorId: advisor2.id,
    },
  });

  const program3 = await prisma.program.create({
    data: {
      name: 'البرنامج الثقافي',
      type: 'CULTURAL',
      status: 'ACTIVE',
      description: 'برنامج لتعزيز الوعي الثقافي والاجتماعي',
      currentAdvisorId: advisor2.id,
    },
  });

  // ====== Students ======
  const student1 = await prisma.student.create({
    data: {
      name: 'خالد أحمد',
      studentNumber: 'S1001',
      grade: 'الصف العاشر',
      section: 'أ',
      gender: 'MALE',
      birthDate: new Date('2007-05-15'),
      phone: '+966511111111',
      address: 'الرياض - حي النخيل',
    },
  });

  const student2 = await prisma.student.create({
    data: {
      name: 'علي',
      studentNumber: 'S1002',
      grade: 'الصف التاسع',
      section: 'ب',
      gender: 'MALE',
      birthDate: new Date('2008-08-20'),
      phone: '+966522222222',
      address: 'جدة - حي الروضة',
    },
  });

  const student3 = await prisma.student.create({
    data: {
      name: 'محمد عبدالله',
      studentNumber: 'S1003',
      grade: 'الصف العاشر',
      section: 'ج',
      gender: 'MALE',
      birthDate: new Date('2007-11-11'),
      phone: '+966533333333',
      address: 'الدمام - حي الشاطئ',
    },
  });

  const student4 = await prisma.student.create({
    data: {
      name: 'خالد',
      studentNumber: 'S1004',
      grade: 'الصف التاسع',
      section: 'أ',
      gender: 'MALE',
      birthDate: new Date('2008-01-25'),
      phone: '+966544444444',
      address: 'مكة - حي العزيزية',
    },
  });

  // ====== Advisor Assignments ======
  await prisma.advisorAssignment.createMany({
    data: [
      { advisorId: advisor1.id, programId: program1.id },
      { advisorId: advisor2.id, programId: program2.id },
      { advisorId: advisor2.id, programId: program3.id },
    ],
  });

  // ====== Student-Program Relations ======
  await prisma.studentProgram.createMany({
    data: [
      { studentId: student1.id, programId: program1.id },
      { studentId: student2.id, programId: program2.id },
      { studentId: student3.id, programId: program1.id },
      { studentId: student4.id, programId: program3.id },
    ],
  });

  // ====== Sessions ======
  const session1 = await prisma.session.create({
    data: {
      programId: program1.id,
      date: new Date('2025-10-05'),
      startTime: '09:00',
      endTime: '11:00',
      location: 'قاعة العلوم',
      recurrencePattern: 'WEEKLY',
      notes: 'جلسة مراجعة علمية',
    },
  });

  const session2 = await prisma.session.create({
    data: {
      programId: program2.id,
      date: new Date('2025-10-06'),
      startTime: '16:00',
      endTime: '18:00',
      location: 'الملعب الخارجي',
      recurrencePattern: 'DAILY',
      notes: 'تدريب كرة القدم',
    },
  });

  const session3 = await prisma.session.create({
    data: {
      programId: program3.id,
      date: new Date('2025-10-07'),
      startTime: '10:00',
      endTime: '12:00',
      location: 'قاعة المسرح',
      recurrencePattern: 'MONTHLY',
      notes: 'ورشة ثقافية',
    },
  });

  // ====== Attendance Records ======
  await prisma.attendanceRecord.createMany({
    data: [
      {
        studentId: student1.id,
        programId: program1.id,
        sessionId: session1.id,
        date: session1.date,
        status: 'PRESENT',
      },
      {
        studentId: student3.id,
        programId: program1.id,
        sessionId: session1.id,
        date: session1.date,
        status: 'ABSENT',
        notes: 'مريض',
      },
      {
        studentId: student2.id,
        programId: program2.id,
        sessionId: session2.id,
        date: session2.date,
        status: 'LATE',
        notes: 'تأخير بسبب المواصلات',
      },
      {
        studentId: student4.id,
        programId: program3.id,
        sessionId: session3.id,
        date: session3.date,
        status: 'PRESENT',
      },
    ],
  });

  console.log('✅ Mock data inserted successfully!');
}

main()
  .then(async (): Promise<void> => {
    await prisma.$disconnect();
  })
  .catch(async (e: unknown): Promise<void> => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
