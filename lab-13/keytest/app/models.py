from django.db import models

from django.db import models

# Modelo para representar un test de mecanografía
class TypingTest(models.Model):
    content = models.TextField()

    # Indica que la tabla en la base de datos se llamará "typing_test"
    class Meta:
        db_table = "typing_test"

    def __str__(self):
        return self.content[:50]

# Modelo para representar los resultados de un test de mecanografía
class TypingTestResult(models.Model):
    wpm = models.FloatField()
    accuracy = models.FloatField()
    duration = models.FloatField()
    created_at = models.DateTimeField(auto_now_add=True)

    test = models.ForeignKey(
        TypingTest,
        on_delete=models.CASCADE,
        db_column="test",
        related_name="results",
    )

    # Indica que la tabla en la base de datos se llamará "typing_test_result"
    class Meta:
        db_table = "typing_test_result"

    def __str__(self):
        return f"{self.wpm} WPM - {self.accuracy}%"
