import { getSubjectName, subjects } from '../data/subjects';

describe('subjects data', () => {
  it('contains the Mobile App Development subject', () => {
    expect(subjects.some((subject) => subject.name === 'Mobile App Development')).toBe(true);
  });

  it('returns a subject name by id', () => {
    expect(getSubjectName('math')).toBe('Mathematics');
  });

  it('returns Unknown Subject for missing subject id', () => {
    expect(getSubjectName('missing')).toBe('Unknown Subject');
  });
});