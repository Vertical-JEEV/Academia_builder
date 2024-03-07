from django.http import HttpResponse

def createClassroom(request):
    return HttpResponse("Create Classroom")

def inviteStudent(request):
    return HttpResponse("Invite Student")

def confirmInvitation(request):
    return HttpResponse("Confirm Invitation")

def renameClassroom(request, pk):
    return HttpResponse(f"Rename Classroom with id {pk}")

def deleteClassroom(request, pk):
    return HttpResponse(f"Delete Classroom with id {pk}")

def removeStudent(request):
    return HttpResponse("Remove Student")