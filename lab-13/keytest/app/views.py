import random
from django.shortcuts import render
from .models import TypingTest


# Vista que maneja la lógica para mostrar un test de mecanografía
def typing_test_view(request):

    # Obtiene todos los tests de mecanografía disponibles desde la base de datos
    tests = list(TypingTest.objects.all())

    # Si no hay tests disponibles, se muestra un mensaje de error en la plantilla
    if not tests:
        return render(request, 'typing_test.html', {
            "error": "No hay tests de mecanografía disponibles."
        })

    # Selecciona un test de mecanografía aleatorio de la lista de tests disponibles
    text = random.choice(tests)

    # Renderiza la plantilla 'typing_test.html' pasando el test seleccionado como contexto
    return render(request, 'typing_test.html', {
        "typing_text": text
    })

