import sqlite3
from app.config.db import SessionLocal, Base, engine
from app.models.songs_model import Song

#  Función para inicializar la base de datos y crear las tablas
def init_db():
    Base.metadata.create_all(bind=engine)

# Función para poblar la base de datos con canciones iniciales
def seed_db():
    db = SessionLocal()
    try:
        initial_songs = [
            Song(title="black diamond", artist="stratovarius", genre="power metal", year=2000),
            Song(title="eagleheart", artist="stratovarius", genre="power metal", year=2002),
            Song(title="unbreakable", artist="stratovarius", genre="power metal", year=2009),
            Song(title="in the end", artist="linkin park", genre="nu metal", year=2000),
            Song(title="numb", artist="linkin park", genre="alternative rock", year=2003),
            Song(title="what i've done", artist="linkin park", genre="alternative rock", year=2007),
            Song(title="castle of glass", artist="linkin park", genre="alternative rock", year=2012),
            Song(title="primo victoria", artist="sabaton", genre="power metal", year=2005),
            Song(title="the greatest love", artist="three the grace", genre="pop rock", year=2007),
            Song(title="adrian", artist="three the grace", genre="pop rock", year=2008),
            Song(title="bukan yang pertama", artist="three the grace", genre="pop rock", year=2010),
            Song(title="tak bisa ke lain hati", artist="three the grace", genre="pop rock", year=2011),
            Song(title="gone", artist="thousand foot krutch", genre="hard rock", year=2003),
            Song(title="phenomenon", artist="thousand foot krutch", genre="alternative metal", year=2003),
            Song(title="war of change", artist="thousand foot krutch", genre="hard rock", year=2011),
            Song(title="be somebody", artist="thousand foot krutch", genre="hard rock", year=2012),
            Song(title="bat country", artist="avenged sevenfold", genre="heavy metal", year=2005),
            Song(title="almost easy", artist="avenged sevenfold", genre="heavy metal", year=2007),
            Song(title="afterlife", artist="avenged sevenfold", genre="heavy metal", year=2008),
            Song(title="the diary of jane", artist="breaking benjamin", genre="alternative rock", year=2005),
            Song(title="i will not bow", artist="breaking benjamin", genre="alternative rock", year=2009),
            Song(title="so cold", artist="breaking benjamin", genre="alternative rock", year=2004),
            Song(title="blow me away", artist="breaking benjamin", genre="alternative rock", year=2002),
            Song(title="down with the sickness", artist="disturbed", genre="heavy metal", year=2000),
            Song(title="stupify", artist="disturbed", genre="nu metal", year=2000),
            Song(title="inside the fire", artist="disturbed", genre="alternative metal", year=2008),
            Song(title="the sound of silence", artist="disturbed", genre="alternative metal", year=2015),
            Song(title="indestructible", artist="disturbed", genre="heavy metal", year=2008),
            Song(title="feel good inc.", artist="gorillaz", genre="alternative rock", year=2005),
            Song(title="clint eastwood", artist="gorillaz", genre="alternative rock", year=2001),
            Song(title="dare", artist="gorillaz", genre="electronic rock", year=2005),
            Song(title="on melancholy hill", artist="gorillaz", genre="alternative rock", year=2010),
            Song(title="rhinestone eyes", artist="gorillaz", genre="alternative rock", year=2010),
            Song(title="end of our time", artist="heavenly", genre="power metal", year=2002),
            Song(title="sign of the winner", artist="heavenly", genre="power metal", year=2001),
            Song(title="spread your fire", artist="heavenly", genre="power metal", year=1998),
            Song(title="when the rain begins to fall", artist="heavenly", genre="power metal", year=2000),
            Song(title="sacrament of wilderness", artist="nightwish", genre="symphonic metal", year=1998),
            Song(title="nemo", artist="nightwish", genre="symphonic metal", year=2004),
            Song(title="wish i had an angel", artist="nightwish", genre="symphonic metal", year=2004),
            Song(title="ecliptica", artist="sonata arctica", genre="power metal", year=1999),
            Song(title="fullmoon", artist="sonata arctica", genre="power metal", year=1999),
            Song(title="reckoning night", artist="sonata arctica", genre="power metal", year=2004),
            Song(title="paid in full", artist="sonata arctica", genre="power metal", year=2004),
            Song(title="flag in the ground", artist="sonata arctica", genre="power metal", year=2009)
        ]
        db.add_all(initial_songs)
        db.commit()
    finally:
        db.close()