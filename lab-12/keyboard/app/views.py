from django.shortcuts import render


def home(request):
	"""Muestra la interfaz para validar un teclado español latinoamericano."""
	# Renderiza el teclado y delega su interacción al JavaScript del template.
	return render(request, 'app/home.html')
