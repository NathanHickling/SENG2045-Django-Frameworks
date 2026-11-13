from django import forms
from .models import Profile

class ProfileForm(forms.ModelForms):
    class Meta:
        model = Profile
        fields = ('bio', 'avatar')