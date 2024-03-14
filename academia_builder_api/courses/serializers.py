from rest_framework import serializers
from .models import Course, Module, SubTopic, Question



# serlizer for the course model
class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ['name']

    def to_representation(self, instance):
        return instance.name


# serializer for the sub-topic model
class SubTopicSerializer(serializers.ModelSerializer):
    class Meta:
        model = SubTopic
        fields = ['id', 'name']


# serializer for the module model
class ModuleSerializer(serializers.ModelSerializer):
    subtopics = SubTopicSerializer(many=True, read_only=True)
    class Meta:
        model = Module
        fields = ['id', 'name', 'subtopics']


class QuestionSerializer(serializers.ModelSerializer):
    subtopic = serializers.SlugRelatedField(slug_field='name', queryset = SubTopic.objects.all())

    class Meta:
        model = Question
        fields = ['id', 'text', 'question_type', 'subtopic', 'answer']


    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['subtopic'] = SubTopicSerializer(instance.subtopic)
        return representation

    
    






