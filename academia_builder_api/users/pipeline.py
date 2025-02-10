from social_core.pipeline.partial import partial
from rest_framework.exceptions import ValidationError
import logging

logger = logging.getLogger(__name__)


@partial
def save_account_type(backend, details, response, *args, **kwargs):
    is_new = kwargs.get('is_new')
    request = backend.strategy.request_data()
    account_type = request.get('account_type')

    logger.debug(f"OAuth Details: {details}")
    logger.debug(f"Response from Google: {response}")

    if is_new:
        if not account_type:
            logger.debug('Account type is missing. Pausing the pipeline.')
            # ✅ This pauses the pipeline until resumed
            return

        if account_type not in ['student', 'teacher']:
            logger.debug(f"Invalid account type provided: {account_type}")
            raise ValidationError(
                'Account type must be either "student" or "teacher".')

        details['account_type'] = account_type
