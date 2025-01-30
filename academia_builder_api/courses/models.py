from django.db import models


# stores the available courses
class Course(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField()

    def __str__(self):
        return self.name

# each course has its own modules so we need to store them and relate it to the course


class Module(models.Model):
    course = models.ForeignKey(
        Course, related_name='modules', on_delete=models.CASCADE)
    name = models.CharField(max_length=200)

    def __str__(self):
        return self.name

# each module has its own subtopics so we need to store them and relate it to the module


class SubTopic(models.Model):
    module = models.ForeignKey(
        Module, related_name='subtopics', on_delete=models.CASCADE)
    name = models.CharField(max_length=200)

    def __str__(self):
        return self.name

# each subtopic has its own questions so we need to store them and relate it to the subtopic


class Question(models.Model):
    QUESTION_TYPES = (
        ('MC', 'Multiple Choice'),
        ('LA', 'Long Answer'),
    )

    # we dont store the module and course because we can get them from the subtopic
    subtopic = models.ForeignKey(
        SubTopic, related_name='questions', on_delete=models.CASCADE)
    question_type = models.CharField(max_length=2, choices=QUESTION_TYPES)
    text = models.TextField()
    # This field can store the answer for long answer questions
    answer = models.TextField(null=True, blank=True)

    def __str__(self):
        return self.text


# if the question is multiple choice we need to store the options and relate them to the question
class MultipleChoiceOption(models.Model):
    question = models.ForeignKey(
        Question, related_name='options', on_delete=models.CASCADE)
    text = models.CharField(max_length=200)
    is_correct = models.BooleanField(default=False)

    def __str__(self):
        return self.text
