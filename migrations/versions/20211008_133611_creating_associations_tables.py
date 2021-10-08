"""creating associations tables

Revision ID: d36dde3dfce3
Revises: 3af04cad7fff
Create Date: 2021-10-08 13:36:11.733028

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'd36dde3dfce3'
down_revision = '3af04cad7fff'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('friends',
    sa.Column('runner1_id', sa.Integer(), nullable=False),
    sa.Column('runner2_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['runner1_id'], ['users.id'], ),
    sa.ForeignKeyConstraint(['runner2_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('runner1_id', 'runner2_id')
    )
    op.create_table('pending_friends',
    sa.Column('acceptor_id', sa.Integer(), nullable=False),
    sa.Column('requester_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['acceptor_id'], ['users.id'], ),
    sa.ForeignKeyConstraint(['requester_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('acceptor_id', 'requester_id')
    )
    op.create_table('runs',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('start_point', sa.String(length=256), nullable=False),
    sa.Column('end_point', sa.String(length=256), nullable=False),
    sa.Column('distance', sa.Float(), nullable=False),
    sa.Column('time', sa.Float(), nullable=False),
    sa.Column('completed', sa.Boolean(), nullable=False),
    sa.Column('runner_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['runner_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('comments',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('body', sa.Text(), nullable=False),
    sa.Column('author_id', sa.Integer(), nullable=True),
    sa.Column('run_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['author_id'], ['users.id'], ),
    sa.ForeignKeyConstraint(['run_id'], ['runs.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('runners_runs',
    sa.Column('runner_id', sa.Integer(), nullable=False),
    sa.Column('run_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['run_id'], ['runs.id'], ),
    sa.ForeignKeyConstraint(['runner_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('runner_id', 'run_id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('runners_runs')
    op.drop_table('comments')
    op.drop_table('runs')
    op.drop_table('pending_friends')
    op.drop_table('friends')
    # ### end Alembic commands ###
