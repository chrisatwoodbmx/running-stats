import { getDistance, getPaceAndSpeed } from '@/workers/Point.worker';

describe('Point worker', () => {
  test('Get correct meters from coordinates', () => {
    expect(
      getDistance(
        [51.57849739305675, -3.230746239423752],
        [51.578479539602995, -3.230768283829093],
      ),
    ).toBe(2.50555441536966);
  });

  test('Get pace and speed from a duration and distance', () => {
    expect(getPaceAndSpeed(2.50555441536966, 1)).toStrictEqual({
      speed: 9.019995895330776,
      pace: 399.113263661633,
    });
  });
});
