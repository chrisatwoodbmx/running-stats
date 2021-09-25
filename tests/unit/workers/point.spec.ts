import { getDistance } from '@/workers/Point.worker';

describe('Point worker', () => {
  test('Get correct meters from coordinates', () => {
    expect(
      getDistance(51.57849739305675, 51.578479539602995, -3.230746239423752, -3.230768283829093),
    ).toBe(2.50555441536966);
  });
});
