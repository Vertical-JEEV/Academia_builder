


class NewUserException(Exception):
    """
    Custom exception to indicate the user is new and we want
    to break out of the normal pipeline flow.
    """
    pass

class NoEmailException(Exception):
    """
    Custom exception to indicate that the user has no email.
    """
    pass