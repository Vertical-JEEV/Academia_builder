

# This pipeline is used to save the account type of the user when they sign up using social authentication.
def save_account_type(backend, user, response, *args, **kwargs):
    account_type = backend.strategy.session_get('account_type')
    if account_type:
        user.account_type = account_type
        user.save()
