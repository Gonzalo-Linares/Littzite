import { tattooReleaseState } from './brand.config.ts';

export const tattooReleaseBlockers = [
  tattooReleaseState.temporaryHeroImage && 'Replace the temporary hero image.',
  tattooReleaseState.temporaryPortfolioImages && 'Replace the temporary portfolio images.',
  tattooReleaseState.temporaryAftercareImage && 'Replace the temporary aftercare image.',
  tattooReleaseState.bookingUrlIsPlaceholder && 'Configure an approved production booking URL.',
].filter((blocker): blocker is string => Boolean(blocker));

export function assertTattooProductionReady() {
  if (tattooReleaseBlockers.length > 0) {
    throw new Error(`Juanjo production release blocked:\n- ${tattooReleaseBlockers.join('\n- ')}`);
  }
}
