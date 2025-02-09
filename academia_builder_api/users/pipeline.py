from rest_framework.exceptions import ValidationError
import logging

logger = logging.getLogger(__name__)


def save_account_type(backend, details, response, *args, **kwargs):
    is_new = kwargs.get('is_new')
    request = backend.strategy.request_data()
    account_type = request.get('account_type')

    if is_new:
        if not account_type:
            logger.debug('Account type is required for new users.')
            raise ValidationError('Account type is required for new users.')

        if account_type not in ['student', 'teacher']:
            logger.debug('Account type must be either "student" or "teacher".')
            raise ValidationError(
                'Account type must be either "student" or "teacher".')

        # ✅ Store account_type temporarily in details for user creation
        details['account_type'] = account_type
