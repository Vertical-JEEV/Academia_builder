from rest_framework.exceptions import ValidationError


def save_account_type(backend, user, response, *args, **kwargs):
    is_new = kwargs.get('is_new')
    request = backend.strategy.request_data()
    account_type = request.get('account_type')

    if is_new:
        if account_type not in ['student', 'teacher']:
            raise ValidationError('Account type must be either student or teacher')
            
        user.account_type = account_type
        user.save()
