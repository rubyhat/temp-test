import { CreateReviewBodyDto } from 'swagger/client';
import { ReviewAnswersState } from './types';

export function answersToDto(
    answers: ReviewAnswersState['answers']
): CreateReviewBodyDto['dislikes'] {
    return Object.entries(answers)
        .filter(([, value]) => value)
        .map(([code]) => code);
}
