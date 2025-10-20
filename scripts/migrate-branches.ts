#!/usr/bin/env ts-node
import 'dotenv/config';
import { connectToMongoDB, disconnectFromMongoDB, mongoose } from '../shared/db';
import '../shared/models/student';
import '../shared/models/instructor';

type Doc = { _id: any; branch?: string } & Record<string, any>;

const Student = mongoose.model('Student');
const Instructor = mongoose.model('Instructor');

const mapping: Record<string, string> = {
  'Mwihoko': 'Mwihoko - stage 160',
  'Kahawa Sukari': 'Mwihoko - discovery',
  'Kasarani': 'Kasarani', // unchanged but included for completeness
};

async function run() {
  const args = process.argv.slice(2);
  const apply = args.includes('--apply');

  console.log('Branch migration script');
  console.log('Mapping:', mapping);
  console.log(apply ? 'Running in APPLY mode (changes will be written).' : 'Dry-run mode (no changes will be written). Use --apply to apply changes.');

  await connectToMongoDB();

  try {
    // Students
    const students = await Student.find({ branch: { $in: Object.keys(mapping) } }).lean();
    console.log(`Found ${students.length} students with old branch values`);
    for (const s of students as Doc[]) {
      const oldBranch = s.branch || '';
      const newBranch = mapping[oldBranch];
      if (!newBranch || newBranch === oldBranch) continue;
      console.log(`Student ${s._id}: ${oldBranch} -> ${newBranch}`);
      if (apply) {
        await Student.updateOne({ _id: s._id }, { $set: { branch: newBranch } });
      }
    }

    // Instructors
    const instructors = await Instructor.find({ branch: { $in: Object.keys(mapping) } }).lean();
    console.log(`Found ${instructors.length} instructors with old branch values`);
    for (const ins of instructors as Doc[]) {
      const oldBranch = ins.branch || '';
      const newBranch = mapping[oldBranch];
      if (!newBranch || newBranch === oldBranch) continue;
      console.log(`Instructor ${ins._id}: ${oldBranch} -> ${newBranch}`);
      if (apply) {
        await Instructor.updateOne({ _id: ins._id }, { $set: { branch: newBranch } });
      }
    }

    console.log('Migration complete.');
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    await disconnectFromMongoDB();
  }
}

// Run the migration
run().catch((e) => {
  console.error(e);
  process.exit(1);
});

export default run;
