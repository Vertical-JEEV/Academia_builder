from django.contrib import admin
from .models import Course, Module, SubTopic, Question, MultipleChoiceOption

class MultipleChoiceOptionAdmin(admin.ModelAdmin):
    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        if db_field.name == "question":
            kwargs["queryset"] = Question.objects.filter(question_type='MC')
        return super().formfield_for_foreignkey(db_field, request, **kwargs)

admin.site.register(Course)
admin.site.register(Module)
admin.site.register(SubTopic)
admin.site.register(Question)
admin.site.register(MultipleChoiceOption, MultipleChoiceOptionAdmin)




